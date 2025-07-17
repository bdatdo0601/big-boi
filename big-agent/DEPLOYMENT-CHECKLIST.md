# Khoj Server Deployment Checklist - Fly.io

Use this checklist to ensure a smooth deployment of your Khoj server to Fly.io.

## Pre-Deployment Checklist

### 1. Prerequisites Setup
- [ ] Fly.io account created and CLI installed
- [ ] Supabase account created and project set up
- [ ] Supabase `vector` extension enabled
- [ ] Required API keys obtained (OpenAI, Anthropic, or Gemini)
- [ ] Domain name configured (if using custom domain)

### 2. Environment Variables
- [ ] `POSTGRES_HOST` - Supabase database host
- [ ] `POSTGRES_DB` - Database name (usually 'postgres')
- [ ] `POSTGRES_USER` - Database user (usually 'postgres')
- [ ] `POSTGRES_PASSWORD` - Your Supabase password
- [ ] `POSTGRES_PORT` - Database port (usually 5432)
- [ ] `KHOJ_DJANGO_SECRET_KEY` - Generated secure secret key
- [ ] `KHOJ_ADMIN_EMAIL` - Admin user email
- [ ] `KHOJ_ADMIN_PASSWORD` - Secure admin password
- [ ] At least one AI API key set

### 3. Optional Configuration
- [ ] `SERPER_DEV_API_KEY` - For enhanced web search
- [ ] `OLOSTEP_API_KEY` - For web search capabilities
- [ ] `E2B_API_KEY` - For code execution
- [ ] `KHOJ_DOMAIN` - Your custom domain
- [ ] `KHOJ_TELEMETRY_DISABLE` - Set to True if desired

## Deployment Steps

### 1. Initial Setup
```bash
# Navigate to project directory
cd big-agent

# Login to Fly.io
flyctl auth login

# Initialize Fly.io app
flyctl launch --no-deploy
```

### 2. Configure Secrets
```bash
# Required secrets
flyctl secrets set POSTGRES_HOST=db.xxx.supabase.co
flyctl secrets set POSTGRES_DB=postgres
flyctl secrets set POSTGRES_USER=postgres
flyctl secrets set POSTGRES_PASSWORD=your-password
flyctl secrets set KHOJ_DJANGO_SECRET_KEY=your-secret-key
flyctl secrets set KHOJ_ADMIN_EMAIL=admin@example.com
flyctl secrets set KHOJ_ADMIN_PASSWORD=your-password
flyctl secrets set OPENAI_API_KEY=sk-your-key

# Optional secrets (add as needed)
flyctl secrets set ANTHROPIC_API_KEY=sk-ant-your-key
flyctl secrets set GEMINI_API_KEY=your-key
flyctl secrets set SERPER_DEV_API_KEY=your-key
flyctl secrets set KHOJ_TELEMETRY_DISABLE=True
```

### 3. Create Volume
```bash
# Create persistent volume for Khoj data
flyctl volumes create khoj_data --size 10
```

### 4. Deploy
```bash
# Deploy the application
flyctl deploy

# Monitor deployment
flyctl logs
```

### 5. Verify Deployment
- [ ] Application starts successfully
- [ ] Health check passes
- [ ] Database connection works
- [ ] Admin login works
- [ ] AI chat functionality works

## Post-Deployment Checklist

### 1. Security
- [ ] Admin password changed from default
- [ ] HTTPS enforced
- [ ] Database credentials rotated
- [ ] API keys verified and limited

### 2. Performance
- [ ] Resource usage monitored
- [ ] Response times acceptable
- [ ] Auto-scaling configured if needed
- [ ] Caching enabled if high traffic

### 3. Monitoring
- [ ] Application logs reviewed
- [ ] Error tracking set up
- [ ] Performance metrics monitored
- [ ] Backup strategy implemented

### 4. Documentation
- [ ] Deployment documented
- [ ] Environment variables documented
- [ ] Access credentials shared with team
- [ ] Troubleshooting guide updated

## Common Issues and Solutions

### Database Connection Issues
```bash
# Check database credentials
flyctl secrets list

# Test database connection
flyctl ssh console
psql -h your-db-host -U postgres -d postgres
```

### Application Won't Start
```bash
# Check logs
flyctl logs --app your-app-name

# Check machine status
flyctl machine list

# Restart machine
flyctl machine restart MACHINE_ID
```

### Performance Issues
```bash
# Scale resources
flyctl scale memory 2048
flyctl scale count 2

# Check resource usage
flyctl ssh console -C "top"
```

## Rollback Plan

### If Deployment Fails
```bash
# Check previous releases
flyctl releases

# Rollback to previous version
flyctl rollback

# Or deploy specific version
flyctl deploy --image-ref registry.fly.io/your-app:previous-version
```

### Emergency Procedures
1. **Complete Outage:**
   - Check Fly.io status page
   - Verify Supabase status
   - Scale machines if needed

2. **Database Issues:**
   - Check Supabase dashboard
   - Verify connection strings
   - Check for maintenance windows

3. **High Resource Usage:**
   - Scale up resources temporarily
   - Investigate root cause
   - Optimize queries or code

## Maintenance Tasks

### Regular Tasks
- [ ] Monitor resource usage weekly
- [ ] Review logs for errors weekly
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Backup database monthly

### Security Updates
- [ ] Update base image regularly
- [ ] Monitor security advisories
- [ ] Update Fly.io CLI
- [ ] Review access logs

### Performance Optimization
- [ ] Analyze slow queries
- [ ] Optimize database indexes
- [ ] Review caching strategy
- [ ] Monitor response times

## Support Resources

- **Fly.io Documentation:** https://fly.io/docs
- **Fly.io Community:** https://community.fly.io
- **Khoj Documentation:** https://docs.khoj.dev
- **Supabase Documentation:** https://supabase.com/docs
- **Khoj GitHub:** https://github.com/khoj-ai/khoj

## Success Criteria

Your deployment is successful when:
- [ ] Application is accessible at your Fly.io URL
- [ ] Admin login works with your credentials
- [ ] Chat functionality works with AI models
- [ ] Data persists across deployments
- [ ] Performance meets your requirements
- [ ] Monitoring and logging are in place
