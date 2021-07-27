#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { IAMStack } from '../lib/iam-stack';
import { InstanceStack } from '../lib/instance-stack';
import { SGStack } from '../lib/sg-stack';

const app = new cdk.App();

const iamStack = new IAMStack(app, 'IAMStack', {
  synthesizer: new cdk.BootstraplessSynthesizer({}),
});

const sgStack = new SGStack(app, 'SgStack', {
  synthesizer: new cdk.BootstraplessSynthesizer({}),
});

new InstanceStack(app, 'InstanceStack', {
  profile: iamStack.instanceProfile,
  role: iamStack.role,
  securityGroup: sgStack.sg,
  synthesizer: new cdk.BootstraplessSynthesizer({}),
});
