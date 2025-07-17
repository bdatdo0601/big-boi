# Khoj AI - Sliplane Deployment Guide

This guide will help you deploy your Khoj AI application to Sliplane for cost-effective hosting.

## 🚀 Quick Setup

### 1. Create Sliplane Account
- Go to [sliplane.io](https://sliplane.io)
- Sign up with your GitHub account
- Connect your repository

### 2. Configure Environment Variables
In your Sliplane dashboard, set these environment variables:

#### Required Variables:
```bash
# Admin Configuration
KHOJ_ADMIN_EMAIL=your-email@example.com
KHOJ_ADMIN_PASSWORD=your-secure-password
KHOJ_DJANGO_SECRET_KEY=your-random-secret-key-minimum-50-characters

# AI API Keys (at least one required)
ANTHROPIC_API_KEY=your-anthropic-api-key
# OPENAI_API_KEY=your-openai-api-key
# GEMINI_API_KEY=your-gemini-api-key
```

#### Optional Variables:
```bash
# Debug mode (set to False for production)
KHOJ_DEBUG=False

# Enhanced web search
SERPER_DEV_API_KEY=your-serper-api-key
OLOSTEP_API_KEY=your-olostep-api-key

# Code execution sandbox
E2B_API_KEY=your-e2b-api-key

# Computer control (VNC)
KHOJ_OPERATOR_ENABLED=False

# Disable telemetry
KHOJ_TELEMETRY_DISABLE=True
```

### 3. Deploy
- Push your code to GitHub
- Sliplane will automatically deploy your application
- Your app will be available at `https://your-app-name.sliplane.app`

## 📋 Server Requirements

### Recommended Sliplane Server:
- **Size**: Small (2 vCPU, 4GB RAM, 80GB SSD)
- **Cost**: ~€6.99/month
- **Performance**: Perfect for personal/small team usage

### Minimal Server:
- **Size**: Micro (1 vCPU, 2GB RAM, 40GB SSD)
- **Cost**: ~€3.99/month
- **Performance**: Suitable for light usage

## 🔧 Configuration Tips

### 1. Database Optimization
The PostgreSQL database will use persistent volumes. Consider:
- Regular backups through Sliplane's backup feature
- Monitor database size growth
- Use database connection pooling if needed

### 2. Security Settings
```bash
# For production deployment
KHOJ_DEBUG=False
KHOJ_NO_HTTPS=False  # Let Sliplane handle HTTPS
KHOJ_TELEMETRY_DISABLE=True
```

### 3. Performance Optimization
- Start with minimal resources and scale up if needed
- Monitor memory usage in Sliplane dashboard
- Consider enabling only necessary features initially

## 📊 Cost Estimation

### Monthly Costs:
- **Sliplane Server**: €3.99 - €6.99/month
- **AI API Usage**: Variable (depends on usage)
  - Anthropic Claude: ~$0.03/1K tokens
  - OpenAI GPT-4: ~$0.06/1K tokens
- **Total**: ~€4-10/month + API costs

### Cost Optimization:
1. Start with smaller server size
2. Monitor API usage and optimize prompts
3. Use Sliplane's scaling features
4. Enable only necessary features

## 🔍 Monitoring & Troubleshooting

### Health Checks
- Sliplane automatically monitors your application
- Health check endpoint: `https://your-app.sliplane.app/health`
- View logs in Sliplane dashboard

### Common Issues:
1. **Memory Issues**: Upgrade server size or optimize configuration
2. **Database Connection**: Check database service health
3. **API Limits**: Monitor API usage and implement rate limiting

### Logs Access:
- View real-time logs in Sliplane dashboard
- Filter by service (server, database)
- Download logs for detailed analysis

## 🔄 Updates & Maintenance

### Automatic Updates:
- Push to GitHub → Sliplane deploys automatically
- Zero-downtime deployments
- Rollback available if needed

### Backup Strategy:
- Enable Sliplane's automatic backups
- Export configuration regularly
- Test restore procedures

## 🆘 Support

### Resources:
- [Sliplane Documentation](https://docs.sliplane.io)
- [Khoj Documentation](https://docs.khoj.dev)
- [GitHub Issues](https://github.com/khoj-ai/khoj/issues)

### Community:
- Sliplane Discord community
- Khoj Discord server
- Stack Overflow tags: `khoj`, `sliplane`

## 🔐 Security Best Practices

1. **Use strong passwords** for admin account
2. **Rotate API keys** regularly
3. **Enable HTTPS** in production
4. **Monitor access logs** regularly
5. **Keep containers updated** via Sliplane
6. **Use environment variables** for all secrets

---

Happy deploying! 🚀
