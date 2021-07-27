import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';


export class SGStack extends cdk.Stack {
  public readonly sg: ec2.ISecurityGroup;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      availabilityZones: ['us-east-1a', 'us-east-1b'],
      publicSubnetIds: ['abc', 'def'],
      vpcId: 'abcd'
    });

    this.sg = new ec2.SecurityGroup(this, 'Sg', {
      vpc,
    })

  }
}
