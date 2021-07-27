import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { IAMStack } from './iam-stack';
import { InstanceStack } from './instance-stack';
import { SGStack } from './sg-stack';

export interface AppStageProps extends cdk.StageProps {
  instanceSize: ec2.InstanceSize;
}


export class AppStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: AppStageProps) {
    super(scope, id, props);

    const iamStack = new IAMStack(this, 'IAMStack', {
      synthesizer: new cdk.BootstraplessSynthesizer({}),
    });

    const sgStack = new SGStack(this, 'SgStack', {
      synthesizer: new cdk.BootstraplessSynthesizer({}),
    });

    new InstanceStack(this, 'InstanceStack', {
      profile: iamStack.instanceProfile,
      role: iamStack.role,
      securityGroup: sgStack.sg,
      synthesizer: new cdk.BootstraplessSynthesizer({}),
      instanceSize: props.instanceSize,
    });

  }
}
