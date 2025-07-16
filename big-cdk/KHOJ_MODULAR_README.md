# Khoj CDK Modular Architecture

This project implements a modular CDK architecture for deploying the Khoj AI application on AWS. The architecture is broken down into specialized nested stacks for better maintainability, reusability, and separation of concerns.

## Architecture Overview

The deployment consists of 5 modular nested stacks, each responsible for a specific functionality:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Main KhojStack                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │  SecretsStack   │ │ DatabaseStack   │ │    IamStack     │  │
│  │                 │ │                 │ │                 │  │
│  │ • DB Secrets    │ │ • Aurora        │ │ • Task Roles    │  │
│  │ • Django Secret │ │   Serverless v2 │ │ • Execution     │  │
│  │ • Admin Secret  │ │ • PostgreSQL    │ │   Roles         │  │
│  │ • API Keys      │ │                 │ │ • Policies      │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘  │
│  ┌─────────────────┐ ┌─────────────────┐                    │
│  │ ContainerStack  │ │LoadBalancerStack│                    │
│  │                 │ │                 │                    │
│  │ • Server Tasks  │ │ • ALB           │                    │
│  │ • Sandbox       │ │ • Target Groups │                    │
│  │ • Search        │ │ • Listeners     │                    │
│  │ • Computer      │ │                 │                    │
│  └─────────────────┘ └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## Stack Breakdown

### 1. SecretsStack (`lib/secrets-stack.ts`)
**Purpose**: Manages all sensitive data and secrets

- **Database Credentials**: Auto-generated PostgreSQL username/password
- **Django Secret Key**: Application secret for Django framework
- **Admin Credentials**: Admin user credentials for Khoj
- **API Keys**: Placeholder for Anthropic API key (manually updated post-deployment)

**Key Features**:
- Auto-generated secure passwords
- Proper secret rotation policies
- IAM-based access control

### 2. DatabaseStack (`lib/database-stack.ts`)
**Purpose**: Manages the Aurora PostgreSQL Serverless v2 database

- **Aurora Serverless v2**: Auto-scaling PostgreSQL cluster
- **Capacity Range**: 0.5-4 ACUs (Aurora Capacity Units)
- **Backup Strategy**: 7-day retention with automated backups
- **Monitoring**: CloudWatch logs and metrics

**Key Features**:
- Cost-optimized serverless scaling
- Encrypted storage
- Automated maintenance windows
- PostgreSQL 15.4 engine

### 3. IamStack (`lib/iam-stack.ts`)
**Purpose**: Manages all IAM roles and policies with least-privilege access

- **Task Execution Role**: For ECS to manage containers
- **Task Role**: For containers to access AWS services
- **Service Communication Role**: For inter-service communication

**Security Features**:
- Least-privilege access patterns
- Resource-specific permissions
- Secret access controls
- CloudWatch logging permissions

### 4. ContainerStack (`lib/container-stack.ts`)
**Purpose**: Manages all ECS Fargate services and containers

**Services**:
- **Khoj Server**: Main application (2GB RAM, 1 vCPU)
- **Terrarium Sandbox**: Python code execution environment (512MB, 0.25 vCPU)
- **SearXNG**: Meta search engine (512MB, 0.25 vCPU)
- **Computer**: VNC desktop environment (1GB, 0.5 vCPU)

**Key Features**:
- Health checks for all services
- CloudWatch logging
- Secrets injection via environment variables
- ECS Execute Command enabled for debugging

### 5. LoadBalancerStack (`lib/load-balancer-stack.ts`)
**Purpose**: Manages public internet access and load balancing

- **Application Load Balancer**: Internet-facing ALB
- **Target Groups**: Health-checked targets for containers
- **Listeners**: HTTP traffic routing to Khoj server

**Features**:
- Health checks on `/health` endpoint
- Auto-scaling target registration
- Public internet accessibility

## Security Architecture

### IAM Security Model
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Execution Role │    │   Task Role     │    │Service Comm    │
│                 │    │                 │    │     Role        │
│ • ECR Access    │    │ • Secrets Read  │    │ • ECS Describe  │
│ • CloudWatch    │    │ • CloudWatch    │    │ • Service       │
│   Logs          │    │   Logs Write    │    │   Discovery     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Secrets Management
- **AWS Secrets Manager**: Centralized secret storage
- **Automatic Rotation**: Built-in rotation policies
- **IAM-based Access**: Role-based secret access
- **Runtime Injection**: Secrets injected as environment variables

### Network Security
- **Default VPC**: Uses AWS default VPC for simplicity
- **Public Subnets**: Fargate tasks with public IP assignment
- **ALB Security**: Internet-facing load balancer with health checks
- **Inter-service Communication**: Direct container networking

## Deployment Instructions

### Prerequisites
```bash
# Install dependencies
npm install

# Configure AWS CLI
aws configure

# Bootstrap CDK (first time only)
npx cdk bootstrap
```

### Deploy the Application
```bash
# Build and deploy
npm run build
npx cdk deploy KhojStack

# Or use the deployment script
chmod +x deploy-khoj.sh
./deploy-khoj.sh
```

### Post-Deployment Configuration

1. **Update Anthropic API Key**:
```bash
aws secretsmanager update-secret \
  --secret-id <AnthropicApiKeySecretArn> \
  --secret-string "your-actual-anthropic-api-key"
```

2. **Monitor Services**:
```bash
# Check ECS service status
aws ecs describe-services \
  --cluster khoj-cluster \
  --services khoj-server khoj-sandbox khoj-search khoj-computer

# View logs
aws logs tail /aws/ecs/khoj-server --follow
```

## Cost Optimization

### Estimated Monthly Costs (us-east-1)
- **Aurora Serverless v2**: $13-50/month (0.5-4 ACUs)
- **ECS Fargate**: $40-80/month (4 services)
- **ALB**: $16/month + data processing
- **Secrets Manager**: $2-4/month (4 secrets)
- **CloudWatch**: $5-15/month (logs + metrics)

**Total**: ~$76-165/month depending on usage

### Cost Optimization Features
- **Serverless Database**: Pay-per-ACU with auto-scaling
- **Right-sized Containers**: Optimized CPU/memory allocation
- **Single ALB**: Shared load balancer for cost efficiency
- **Log Retention**: 1-month retention to control storage costs

## Monitoring and Observability

### CloudWatch Integration
- **Container Logs**: Structured logging for all services
- **Metrics**: ECS and Aurora metrics
- **Alarms**: Health check failures and resource utilization

### Health Monitoring
- **Application Health**: `/health` endpoint checks
- **Container Health**: Container-level health checks
- **Database Health**: Aurora cluster monitoring

## Development and Debugging

### Local Development
```bash
# Synthesize without deployment
npx cdk synth KhojStack

# Compare changes
npx cdk diff KhojStack

# View CloudFormation template
ls cdk.out/
```

### Container Debugging
```bash
# Execute commands in running containers
aws ecs execute-command \
  --cluster khoj-cluster \
  --task <task-arn> \
  --container server \
  --interactive \
  --command "/bin/bash"
```

### Log Analysis
```bash
# Stream logs from all services
aws logs tail /aws/ecs/khoj-server --follow
aws logs tail /aws/ecs/khoj-sandbox --follow
aws logs tail /aws/ecs/khoj-search --follow
aws logs tail /aws/ecs/khoj-computer --follow
```

## Customization Guide

### Adding New Services
1. Create container definition in `ContainerStack`
2. Add IAM permissions in `IamStack`
3. Create secrets if needed in `SecretsStack`
4. Update load balancer if publicly accessible

### Scaling Configuration
```typescript
// In ContainerStack
const serverService = new ecs.FargateService(this, 'KhojServerService', {
  // ... existing config
  desiredCount: 2,    // Scale to 2 instances
  minCapacity: 1,     // Minimum instances
  maxCapacity: 5,     // Maximum instances
});

// Add auto-scaling
const scaling = serverService.autoScaleTaskCount({
  minCapacity: 1,
  maxCapacity: 5,
});

scaling.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 70,
});
```

### Database Scaling
```typescript
// In DatabaseStack
serverlessV2MinCapacity: 1,    // Increase minimum
serverlessV2MaxCapacity: 8,    // Increase maximum
```

## Security Best Practices

### CDK Nag Integration
```typescript
// Enable in bin/big-cdk.ts
import { AwsSolutionsChecks } from 'cdk-nag';
AwsSolutionsChecks.check(app);
```

### Production Hardening Checklist
- [ ] Enable deletion protection on Aurora cluster
- [ ] Configure VPC with private subnets
- [ ] Add WAF protection to ALB
- [ ] Enable GuardDuty
- [ ] Set up CloudTrail logging
- [ ] Configure backup and disaster recovery
- [ ] Implement secret rotation
- [ ] Add monitoring and alerting

## Troubleshooting

### Common Issues

1. **Container Won't Start**:
   - Check CloudWatch logs for error messages
   - Verify secrets are accessible
   - Ensure proper IAM permissions

2. **Database Connection Issues**:
   - Check database endpoint configuration
   - Verify security group rules
   - Confirm credentials in Secrets Manager

3. **Load Balancer Issues**:
   - Check target group health status
   - Verify container health checks
   - Ensure proper port configuration

### Getting Help
- **AWS Documentation**: Check CDK and service-specific docs
- **CloudWatch Logs**: Primary source for application issues
- **AWS Support**: For infrastructure-level problems
- **Khoj Documentation**: For application-specific questions

---

This modular architecture provides a scalable, maintainable, and cost-effective deployment of Khoj on AWS while following security best practices and infrastructure as code principles.
