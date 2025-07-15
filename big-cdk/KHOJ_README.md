# Khoj CDK Stack

This CDK stack converts the Khoj Docker Compose setup to a production-ready AWS infrastructure using ECS Fargate and Aurora PostgreSQL Serverless v2.

## Architecture Overview

The stack creates the following AWS resources:

### Core Infrastructure
- **VPC**: Multi-AZ VPC with public, private, and isolated subnets
- **ALB**: Application Load Balancer for public access to Khoj
- **ECS Cluster**: Fargate cluster for running containers
- **Aurora PostgreSQL**: Serverless v2 cluster for the database

### Services
1. **Khoj Server**: Main application container (public-facing via ALB)
2. **Terrarium Sandbox**: Python code execution environment
3. **SearXNG**: Meta search engine
4. **Computer**: VNC-enabled container for GUI operations

### Security & Monitoring
- **Secrets Manager**: Database credentials management
- **CloudWatch Logs**: Centralized logging for all services
- **Security Groups**: Least-privilege network access
- **IAM Roles**: Task-specific permissions

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           Internet                               │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
                    ┌──────────┐
                    │    ALB   │
                    └─────┬────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                        VPC                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │  Public Subnet  │  │  Private Subnet  │  │ Isolated Subnet │   │
│  │                 │  │                 │  │                 │   │
│  │   NAT Gateway   │  │   ECS Fargate   │  │   Aurora RDS    │   │
│  │                 │  │                 │  │                 │   │
│  │                 │  │ ┌─────────────┐ │  │ ┌─────────────┐ │   │
│  │                 │  │ │Khoj Server  │ │  │ │PostgreSQL   │ │   │
│  │                 │  │ │             │ │  │ │Serverless v2│ │   │
│  │                 │  │ └─────────────┘ │  │ └─────────────┘ │   │
│  │                 │  │                 │  │                 │   │
│  │                 │  │ ┌─────────────┐ │  │                 │   │
│  │                 │  │ │ Terrarium   │ │  │                 │   │
│  │                 │  │ │  Sandbox    │ │  │                 │   │
│  │                 │  │ └─────────────┘ │  │                 │   │
│  │                 │  │                 │  │                 │   │
│  │                 │  │ ┌─────────────┐ │  │                 │   │
│  │                 │  │ │  SearXNG    │ │  │                 │   │
│  │                 │  │ │   Search    │ │  │                 │   │
│  │                 │  │ └─────────────┘ │  │                 │   │
│  │                 │  │                 │  │                 │   │
│  │                 │  │ ┌─────────────┐ │  │                 │   │
│  │                 │  │ │  Computer   │ │  │                 │   │
│  │                 │  │ │   (VNC)     │ │  │                 │   │
│  │                 │  │ └─────────────┘ │  │                 │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### 🔒 Security
- **Least Privilege**: IAM roles with minimal required permissions
- **Network Isolation**: Database in isolated subnets
- **Secrets Management**: Database credentials in AWS Secrets Manager
- **Encryption**: RDS storage encryption enabled

### 📊 Observability
- **CloudWatch Logs**: Centralized logging for all services
- **Container Insights**: ECS cluster monitoring
- **Health Checks**: Container health monitoring
- **Metrics**: Database and application metrics

### 🚀 Scalability
- **Aurora Serverless v2**: Auto-scaling database (0.5-2 ACUs)
- **ECS Fargate**: Serverless containers
- **Application Load Balancer**: Distributes traffic
- **Auto Scaling**: Can be configured for high availability

### 💰 Cost Optimization
- **Serverless Architecture**: Pay only for what you use
- **Aurora Serverless v2**: Cost-effective database scaling
- **Single NAT Gateway**: Reduced networking costs
- **Optimized Instance Sizes**: Right-sized for workload

## Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js and npm installed
- CDK CLI installed (`npm install -g aws-cdk`)

### Deploy the Stack

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Bootstrap CDK** (first time only):
   ```bash
   npx cdk bootstrap
   ```

3. **Deploy using the script**:
   ```bash
   ./deploy-khoj.sh
   ```

   Or manually:
   ```bash
   npm run build
   npx cdk deploy KhojStack
   ```

### Post-Deployment Configuration

After deployment, you'll need to:

1. **Update API Keys**: Replace placeholder values in the ECS task definition:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `KHOJ_DJANGO_SECRET_KEY`: Generate a secure secret key
   - `KHOJ_ADMIN_PASSWORD`: Set a secure admin password

2. **Configure Secrets Manager**: Store sensitive values in AWS Secrets Manager:
   ```bash
   aws secretsmanager create-secret \
     --name "khoj-anthropic-api-key" \
     --secret-string "your-anthropic-api-key"
   ```

3. **Enable Production Features**:
   - Set `deletionProtection: true` for the database
   - Enable Multi-AZ for the Aurora cluster
   - Configure backup retention policies
   - Set up monitoring and alerting

## Configuration

### Environment Variables

The Khoj server container supports these environment variables:

- `POSTGRES_DB`: Database name (default: postgres)
- `POSTGRES_USER`: Database username (default: postgres)
- `POSTGRES_HOST`: Database endpoint (auto-configured)
- `POSTGRES_PORT`: Database port (default: 5432)
- `KHOJ_DJANGO_SECRET_KEY`: Django secret key
- `KHOJ_DEBUG`: Enable debug mode (default: True)
- `KHOJ_ADMIN_EMAIL`: Admin user email
- `KHOJ_ADMIN_PASSWORD`: Admin user password
- `KHOJ_TERRARIUM_URL`: Sandbox service URL (auto-configured)
- `KHOJ_SEARXNG_URL`: Search service URL (auto-configured)
- `ANTHROPIC_API_KEY`: Anthropic API key for AI features

### Database Configuration

The Aurora PostgreSQL Serverless v2 cluster is configured with:

- **Engine**: PostgreSQL 15.4
- **Capacity**: 0.5-2 ACUs (auto-scaling)
- **Backup**: 7-day retention
- **Encryption**: Enabled
- **Maintenance Window**: Sunday 04:00-05:00 UTC

### Service Discovery

Internal service communication uses AWS Cloud Map:
- `khoj-sandbox.khoj-cluster.local:8080` → Terrarium sandbox
- `khoj-search.khoj-cluster.local:8080` → SearXNG search
- `khoj-computer.khoj-cluster.local:5900` → Computer service

## Monitoring & Troubleshooting

### CloudWatch Logs
- `/aws/ecs/khoj-server` → Main application logs
- `/aws/ecs/khoj-sandbox` → Sandbox service logs
- `/aws/ecs/khoj-search` → Search service logs
- `/aws/ecs/khoj-computer` → Computer service logs

### Common Issues

1. **Database Connection Issues**:
   - Check security group rules
   - Verify database endpoint in environment variables
   - Ensure Secrets Manager permissions

2. **Service Discovery Problems**:
   - Verify Cloud Map namespace configuration
   - Check ECS service registration

3. **Container Startup Failures**:
   - Check CloudWatch logs for error messages
   - Verify container health checks
   - Ensure sufficient memory/CPU allocation

### Health Checks

- **Server**: `curl -f http://localhost:42110/health`
- **Sandbox**: `curl -f http://localhost:8080/health`
- **Search**: HTTP 200 on port 8080
- **Computer**: Port 5900 accessibility

## Security Considerations

### CDK Nag Integration

The stack includes CDK Nag suppressions for common security checks. To enable full security validation:

```typescript
// In bin/big-cdk.ts
import { AwsSolutionsChecks } from 'cdk-nag';
AwsSolutionsChecks.check(app);
```

### Production Security Checklist

- [ ] Enable deletion protection on RDS
- [ ] Configure VPC Flow Logs
- [ ] Set up AWS WAF on ALB
- [ ] Enable GuardDuty
- [ ] Configure AWS Config rules
- [ ] Set up CloudTrail logging
- [ ] Implement least-privilege IAM policies
- [ ] Enable RDS encryption at rest
- [ ] Configure backup and disaster recovery

## Cost Optimization

### Estimated Monthly Costs (us-east-1)

- **Aurora Serverless v2**: ~$13-50/month (0.5-2 ACUs)
- **ECS Fargate**: ~$30-60/month (4 tasks)
- **ALB**: ~$16/month + data processing
- **NAT Gateway**: ~$32/month + data processing
- **CloudWatch Logs**: ~$5-10/month

**Total**: ~$96-168/month (varies by usage)

### Cost Optimization Tips

1. **Right-size Aurora**: Monitor ACU usage and adjust min/max
2. **Optimize Fargate**: Use minimal CPU/memory for tasks
3. **Configure log retention**: Set appropriate retention periods
4. **Use Spot instances**: For non-critical workloads
5. **Schedule resources**: Stop development environments when not in use

## Cleanup

To destroy the stack and avoid ongoing costs:

```bash
npx cdk destroy KhojStack
```

**Warning**: This will delete all resources including the database. Ensure you have backups if needed.

## Contributing

To modify the stack:

1. Update the CDK code in `lib/khoj-stack.ts`
2. Test changes with `npx cdk diff KhojStack`
3. Deploy with `npx cdk deploy KhojStack`
4. Run CDK Nag checks for security compliance

## Support

For issues with:
- **CDK Stack**: Check CloudFormation console and CDK logs
- **Khoj Application**: Refer to [Khoj documentation](https://docs.khoj.dev/)
- **AWS Services**: Consult AWS documentation and support

---

*This stack provides a production-ready deployment of Khoj on AWS with best practices for security, scalability, and cost optimization.*
