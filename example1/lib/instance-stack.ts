import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';

export interface InstanceStackProps extends cdk.StackProps {
  role: iam.IRole;
  securityGroup: ec2.ISecurityGroup;
  profile: iam.CfnInstanceProfile;
  instanceSize: ec2.InstanceSize;
}

export class InstanceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: InstanceStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      availabilityZones: ['us-east-1a', 'us-east-1b'],
      publicSubnetIds: ['abc', 'def'],
      vpcId: 'abcd'
    });

    const instance = new ec2.Instance(this, 'MyInstance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, props.instanceSize),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      vpc,
      role: props.role,
      securityGroup: props.securityGroup,
    });

    instance.node.tryRemoveChild('InstanceProfile');
    instance.instance.iamInstanceProfile = props.profile.ref;
  }
}

