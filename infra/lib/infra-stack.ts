import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });

    // Create a load-balanced Fargate service and make it public
    const task = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster, // Required
      cpu: 512, // Default is 256
      desiredCount: 1, // Default is 1
      taskImageOptions: { 
        image: ecs.ContainerImage.fromRegistry("raphabot/java-goof:latest"),
        containerPort: 8080,
        environment: {
          TREND_AP_KEY: 'f09371c7-b480-424e-a300-1aa614319d58',
          TREND_AP_SECRET: 'a744dac6-ba47-4ab3-9604-c877eaf9afd9',
        }
      },
      memoryLimitMiB: 1024, // Default is 512
      publicLoadBalancer: true, // Default is false,
      listenerPort: 8080,

    });

    // task.taskDefinition.defaultContainer?.addPortMappings(
    //   {
    //     "hostPort": 8080,
    //     "protocol": ecs.Protocol.TCP,
    //     "containerPort": 8080
    //   }
    // );
  }
}
