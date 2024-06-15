import {
  aws_lambda,
  Stack,
  StackProps,
  Duration,
  aws_logs,
  aws_iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
import { Code } from "aws-cdk-lib/aws-lambda";

export class LambdaLlrtStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const llrtLayer = new aws_lambda.LayerVersion(this, "LlrtArmLayer", {
      code: aws_lambda.Code.fromAsset(
        path.join(__dirname, "../llrt-runtime", "llrt-lambda-arm64.zip")
      ),
      compatibleRuntimes: [aws_lambda.Runtime.PROVIDED_AL2],
      compatibleArchitectures: [aws_lambda.Architecture.ARM_64],
    });

    const lambdaExecutionRole = new aws_iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new aws_iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });

    new aws_lambda.Function(this, "HelloLlrtFunction", {
      functionName: "example-hello-llrt",
      code: Code.fromAsset(path.join(__dirname, "../dist")),
      timeout: Duration.seconds(30),
      handler: "index.handler",
      architecture: aws_lambda.Architecture.ARM_64,
      logRetention: aws_logs.RetentionDays.ONE_WEEK,
      runtime: aws_lambda.Runtime.PROVIDED_AL2,
      layers: [llrtLayer],
      role: lambdaExecutionRole,
      memorySize: 128,
    });
  }
}
