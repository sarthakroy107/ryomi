import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3Notifications from "aws-cdk-lib/aws-s3-notifications";
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";


export class HonoAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Fetch parameters from SSM Parameter Store
    const databaseUrl = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/DATABASE_URL"
    );

    const s3InputBucketName = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_S3_UPLOAD_BUCKET_NAME"
    );

    const s3OutputBucketName = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_S3_OUTPUT_BUCKET_NAME"
    );

    const sqsUrl = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_SQS_URL"
    );

    const sqsARN = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_SQS_ARN"
    );

    const ryomiVpcSg1 = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_RYOMI_VPC_SG_1"
    );

    const ryomiVpcSubnetA = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_RYOMI_VPC_PUBLIC_SUBNET"
    );

    const ecsClusterName = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_ECS_CLUSTER_NAME"
    );

    const ecsTaskDefinitionArn = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_ECS_TASK_DEFINITION"
    );

    const ecsMLTaskDefinitionArn = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/AWS_ECS_ML_TASK_DEFINITION"
    );

    const razorpayKeyId = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/RAZORPAY_KEYID"
    );

    const razorpayKeySecret = ssm.StringParameter.valueForStringParameter(
      this,
      "/transcoder/RAZORPAY_SECRETKEY"
    );

    // Import existing S3 bucket and SQS queue
    const s3InputBucket = s3.Bucket.fromBucketName(
      this,
      "ImportedBucket",
      s3InputBucketName
    );

    const s3OutputBucket = s3.Bucket.fromBucketName(
      this,
      "ImportedOutputBucket",
      s3OutputBucketName
    );

    const ryomiHostedZone = route53.HostedZone.fromLookup(this, "RyomiHostedZone", {
      domainName: "ryomi.site",

    })

    const certificate = new certificatemanager.Certificate(this, "RyomiAPICertificate", {
      domainName: "api.ryomi.site",
      validation: certificatemanager.CertificateValidation.fromDns(ryomiHostedZone),
    });

    const sqsQueue = sqs.Queue.fromQueueArn(this, "ImportedQueue", sqsARN);

    // Define the main Hono Lambda function
    const honoServer = new NodejsFunction(this, "lambda", {
      entry: "lambda/hono-router/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(15),
      environment: {
        DATABASE_URL: databaseUrl,
        AWS_S3_BUCKET_NAME: s3InputBucketName,
        AWS_SQS_URL: sqsUrl,
        AWS_S3_INPUT_BUCKET_NAME: s3InputBucketName,
        AWS_S3_OUTPUT_BUCKET_NAME: s3OutputBucketName,
        RAZORPAY_KEYID: razorpayKeyId,
        RAZORPAY_KEYSECRET: razorpayKeySecret,
      },
      functionName: "hono",
    });

    // Define the SQS consumer Lambda function
    const sqsConsumer = new NodejsFunction(this, "sqs-consumer", {
      entry: "lambda/sqs-consumer/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(60),
      environment: {
        AWS_RYOMI_VPC_SG_1: ryomiVpcSg1,
        AWS_RYOMI_VPC_SUBNET_A: ryomiVpcSubnetA,
        AWS_ECS_CLUSTER_NAME: ecsClusterName,
        AWS_ECS_TASK_DEFINITION: ecsTaskDefinitionArn,
        AWS_ECS_ML_TASK_DEFINITION: ecsMLTaskDefinitionArn,
      },
    });

    //Define S3 uplaod notification lambda
    const s3UplaodEventLambda = new NodejsFunction(this, "s3-upload-event", {
      entry: "lambda/s3-upload-event/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      environment: {
        DATABASE_URL: databaseUrl,
      },
    });

    const s3UploadFromECSEventLambda = new NodejsFunction(
      this,
      "s3-upload-from-ecs-event",
      {
        entry: "lambda/s3-upload-from-ecs-event/index.ts",
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(30),
        environment: {
          DATABASE_URL: databaseUrl,
        },
      }
    );

    // Grant S3 read/write permissions to the Hono Lambda function
    s3InputBucket.grantReadWrite(honoServer);

    //Grant S3 read permission to the S3 upload event lambda
    s3InputBucket.grantRead(s3UplaodEventLambda);

    //Grant S3 read permission to the S3 upload from ECS event lambda
    s3OutputBucket.grantRead(s3UploadFromECSEventLambda);

    // Grant S3 read/write permissions to the SQS consumer Lambda function
    s3OutputBucket.grantReadWrite(honoServer);

    //Create S3 event notification for the S3 upload event lambda
    s3InputBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3Notifications.LambdaDestination(s3UplaodEventLambda)
    );

    //Create S3 event notification for the S3 upload from ECS event lambda
    s3OutputBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3Notifications.LambdaDestination(s3UploadFromECSEventLambda)
    );

    // Grant SQS permissions to the Hono Lambda function for sending messages
    sqsQueue.grantSendMessages(honoServer);

    // Grant SQS permissions to the SQS consumer Lambda function for consuming messages
    sqsQueue.grantConsumeMessages(sqsConsumer);

    // Add SQS event source to the SQS consumer Lambda function
    sqsConsumer.addEventSource(
      new lambdaEventSources.SqsEventSource(sqsQueue, {
        batchSize: 1,
      })
    );

    // Add necessary permissions for ECS tasks and IAM role passing
    sqsConsumer.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ecs:RunTask", "ecs:DescribeTasks", "ecs:StopTask"],
        resources: ["*"], //? Replace with the ECS cluster ARN 
      })
    );

    // Add permission to pass the ECS task execution role
    sqsConsumer.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["iam:PassRole"],
        resources: [
          "*", //? Replace with the ECS task execution role ARN
        ],
      })
    );

    // Add Function URL for the Hono Lambda function
    honoServer.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    // Grant SES send email permission
    honoServer.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"], // You can restrict this to specific identities
      })
    );

    // API Gateway setup for the Hono Lambda function
    const honoApiGw = new apigw.LambdaRestApi(this, "myapi", {
      handler: honoServer,
      domainName: {
        domainName: "api.ryomi.site",
        certificate: certificate,

      },
      defaultCorsPreflightOptions: {
        allowOrigins: [
          "http://localhost:3000",
          "https://d26c4nzqgizlj5.cloudfront.net",
          "https://ryomi.site",
        ], // Use exact origin
        allowMethods: apigw.Cors.ALL_METHODS,
        allowCredentials: true,
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
          ...apigw.Cors.DEFAULT_HEADERS,
        ],
      },
    });

    new route53.ARecord(this, "RyomiAPIRecord", {
      recordName: "api",
      zone: ryomiHostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.ApiGateway(honoApiGw)
      ),
    })
    
  }
}
