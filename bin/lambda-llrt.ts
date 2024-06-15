#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LambdaLlrtStack } from "../lib/lambda-llrt-stack";
import { config } from "dotenv";

config();

const app = new cdk.App();
new LambdaLlrtStack(app, "LambdaLlrtStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
