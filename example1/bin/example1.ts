#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { AppStage } from '../lib/stage';

const app = new cdk.App();

new AppStage(app, 'Dev', {
  instanceSize: ec2.InstanceSize.SMALL,
  env: {
    account: '111111111111',
    region: 'us-east-1',
  }
});

new AppStage(app, 'Stage', {
  instanceSize: ec2.InstanceSize.SMALL,
  env: {
    account: '222222222222',
    region: 'us-east-1',
  }
});

new AppStage(app, 'Prod', {
  instanceSize: ec2.InstanceSize.LARGE,
  env: {
    account: '333333333333',
    region: 'us-east-1',
  }
});
