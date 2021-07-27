import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';


export class IAMStack extends cdk.Stack {
  public readonly role: iam.IRole;
  public readonly instanceProfile: iam.CfnInstanceProfile;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2'),
    });
    role.withoutPolicyUpdates();

    this.role = role;

    const profile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [this.role.roleName],
    });

    this.instanceProfile = profile;
  }
}
