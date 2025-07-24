import { Duration } from "aws-cdk-lib";
import {
  Code,
  FunctionProps,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export interface TypeScriptLambdaProps {
  readonly functionName: string;
  readonly codePath: string;
  readonly timeout?: Duration;
  readonly memorySize?: number;
  readonly environment?: { [key: string]: string };
  readonly handler?: string;
  readonly description?: string;
}

export class TypeScriptLambda extends Construct {
  public readonly lambdaFunction: LambdaFunction;

  constructor(scope: Construct, id: string, props: TypeScriptLambdaProps) {
    super(scope, id);

    const compiledTypeScriptPath = path.join(props.codePath, "dist");

    // Check if the compiled TypeScript directory exists
    if (!require("fs").existsSync(compiledTypeScriptPath)) {
      throw new Error(
        `Compiled TypeScript directory does not exist: ${compiledTypeScriptPath}`,
      );
    }

    const functionProps: FunctionProps = {
      functionName: props.functionName,
      runtime: Runtime.NODEJS_22_X,
      code: Code.fromAsset(compiledTypeScriptPath),
      handler: props.handler ?? "index.handler",
      timeout: props.timeout ?? Duration.seconds(30),
      memorySize: props.memorySize ?? 128,
      environment: props.environment,
      description: props.description,
    };

    this.lambdaFunction = new LambdaFunction(this, id, functionProps);
  }
}
