import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cfn_inc from 'aws-cdk-lib/cloudformation-include';
import { Construct } from 'constructs';

export class CDKToolkit extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const bootstrapTemplate = new cfn_inc.CfnInclude(this, 'CDKToolkit', {
      templateFile: 'templates/bootstrap-template.yml',
      parameters: {
        TrustedAccounts: ['111111111111'],
        TrustedAccountsForLookup: [],
        CloudFormationExecutionPolicies: ['arn:aws:iam::aws:policy/AdministratorAccess'],
      },
    });

    const trustedAssumeRoleStatement = new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      principals: [
        new iam.AccountPrincipal('111111111111'),
        new iam.AccountPrincipal(cdk.Fn.sub('${AWS::AccountId}')),
      ],
      conditions:
      {
        StringEquals: {
          'sts:ExternalId': 'some-external-id',
        },
      },
    });

    const assumeRoleStatement = new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      conditions:
      {
        StringEquals: {
          'sts:ExternalId': 'some-external-id',
        },
      },
      principals: [
        new iam.AccountPrincipal('222222222222'),
      ],
    });

    const fileRole = bootstrapTemplate.getResource('FilePublishingRole') as iam.CfnRole;
    const imageRole = bootstrapTemplate.getResource('ImagePublishingRole') as iam.CfnRole;
    const deployRole = bootstrapTemplate.getResource('DeploymentActionRole') as iam.CfnRole;

    fileRole.assumeRolePolicyDocument = new iam.PolicyDocument({
      statements: [
        trustedAssumeRoleStatement,
        assumeRoleStatement,
      ],
    });

    imageRole.assumeRolePolicyDocument = new iam.PolicyDocument({
      statements: [
        trustedAssumeRoleStatement,
        assumeRoleStatement,
      ],
    });

    deployRole.assumeRolePolicyDocument = new iam.PolicyDocument({
      statements: [
        trustedAssumeRoleStatement,
        assumeRoleStatement,
      ],
    });

    new iam.Role(this, 'SomeOtherRole', {
      roleName: cdk.Fn.sub('cdk-${Qualifier}-some-other-role-${AWS::AccountId}-${AWS::Region}'),
      assumedBy: new iam.AccountPrincipal('222222222222'),
      externalIds: ['some-external-id'],
      inlinePolicies: {
        [cdk.Fn.sub('cdk-${Qualifier}-some-other-default-policy-${AWS::AccountId}-${AWS::Region}')]: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['sts:AssumeRole'],
              resources: [
                cdk.Fn.sub('arn:aws:iam::${AWS::AccountId}:role/*-deploy-role-*'),
                cdk.Fn.sub('arn:aws:iam::${AWS::AccountId}:role/*-publishing-role-*'),
              ],
            }),
          ],
        }),
      },
    });

  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

new CDKToolkit(app, 'CDKToolkit', {
  env: devEnv,
  synthesizer: new cdk.BootstraplessSynthesizer({}),
});
app.synth();

