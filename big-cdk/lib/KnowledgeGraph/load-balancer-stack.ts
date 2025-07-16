import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export interface LoadBalancerStackProps extends cdk.NestedStackProps {
  cluster: ecs.Cluster;
  serverService: ecs.FargateService;
  serverContainer: ecs.ContainerDefinition;
}

export class LoadBalancerStack extends cdk.NestedStack {
  public readonly alb: elbv2.ApplicationLoadBalancer;
  public readonly targetGroup: elbv2.ApplicationTargetGroup;
  public readonly listener: elbv2.ApplicationListener;

  constructor(scope: Construct, id: string, props: LoadBalancerStackProps) {
    super(scope, id, props);

    // Create Application Load Balancer
    this.alb = new elbv2.ApplicationLoadBalancer(this, 'KhojLoadBalancer', {
      internetFacing: true,
      loadBalancerName: 'khoj-alb',
      vpc: props.cluster.vpc,
    });

    // Create target group for the main server
    this.targetGroup = new elbv2.ApplicationTargetGroup(this, 'ServerTargetGroup', {
      port: 42110,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      vpc: props.cluster.vpc,
      healthCheck: {
        path: '/health',
        port: '42110',
        protocol: elbv2.Protocol.HTTP,
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
        timeout: cdk.Duration.seconds(10),
        interval: cdk.Duration.seconds(30),
      },
    });

    // Add listener to ALB
    this.listener = this.alb.addListener('KhojListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultTargetGroups: [this.targetGroup],
    });

    // Register the server service with the target group
    props.serverService.registerLoadBalancerTargets(
      {
        containerName: 'server',
        containerPort: 42110,
        newTargetGroupId: 'ECS',
        listener: ecs.ListenerConfig.applicationListener(this.listener, {
          protocol: elbv2.ApplicationProtocol.HTTP,
        }),
      }
    );

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: this.alb.loadBalancerDnsName,
      description: 'DNS name of the load balancer',
    });

    new cdk.CfnOutput(this, 'KhojUrl', {
      value: `http://${this.alb.loadBalancerDnsName}`,
      description: 'Khoj application URL',
    });

    new cdk.CfnOutput(this, 'LoadBalancerArn', {
      value: this.alb.loadBalancerArn,
      description: 'Application Load Balancer ARN',
    });

    new cdk.CfnOutput(this, 'TargetGroupArn', {
      value: this.targetGroup.targetGroupArn,
      description: 'Target Group ARN',
    });
  }
}
