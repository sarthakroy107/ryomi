#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HonoAwsStack } from "../lib/hono-aws-stack";
import * as dotenv from "dotenv";

dotenv.config();

const app = new cdk.App();
new HonoAwsStack(app, "HonoAwsStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: {
    account: process.env.AWS_ACCOUNT_ID, 
    region: process.env.AWS_DEFAULT_REGION,
  },
});


// env: {
//   account: process.env.AWS_ACCOUNT_ID, 
//   region: process.env.AWS_DEFAULT_REGION,
// },