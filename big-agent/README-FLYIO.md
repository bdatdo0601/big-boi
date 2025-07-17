# Khoj Server - Fly.io Deployment

This directory contains the configuration for deploying the Khoj server to Fly.io using Supabase as the database provider.

## Prerequisites

1. **Fly.io Account**
   - Sign up at [fly.io](https://fly.io)
   - Install the Fly CLI: `curl -L https://fly.io/install.sh | sh`
   - Login: `flyctl auth login`

2. **Supabase Account**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your database connection details

3. **Required Environment Variables**
   - API keys for AI services (OpenAI, Anthropic, Gemini)
   - Supabase database credentials
   - Other optional service keys

## Project Structure

```
big-agent/
├── Dockerfile              # Main Dockerfile for Khoj server
├── fly.toml                # Fly.io configuration
├── .dockerignore           # Docker ignore file
├── .env.example            # Environment variables template
└── README-FLYIO.md         # This file
```

## Setup Instructions

### 1. Initialize Fly.io Application

```bash
# Navigate to the big-agent directory
cd big-agent

# Initialize a new Fly.io app (this will create fly.toml)
flyctl launch --no-deploy

# When prompted:
# - Choose an app name (e.g., khoj-server-yourname)
# - Select a region (choose one close to your users)
# - Don't set up a database (we'll use Supabase)
# - Don't deploy now
```

### 2. Configure Supabase Database

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be provisioned

2. **Enable Required Extensions:**
   - Go to Database → Extensions in your Supabase dashboard
   - Enable the `vector` extension (equivalent to pgvector)

3. **Get Connection Details:**
   - Go to Settings → Database
   - Note down the connection string and credentials:
     - Host: `db.xxx.supabase.co`
     - Database: `postgres`
     - Port: `5432`
     - User: `postgres`
     - Password: `[your-password]`

### 3. Set Environment Variables

Set your secrets in Fly.io (replace with your actual values):

```bash
# Database configuration (Supabase)
flyctl secrets set POSTGRES_HOST=db.xxx.supabase.co
flyctl secrets set POSTGRES_DB=postgres
flyctl secrets set POSTGRES_USER=postgres
flyctl secrets set POSTGRES_PASSWORD=your-supabase-password
flyctl secrets set POSTGRES_PORT=5432

# Khoj configuration
flyctl secrets set KHOJ_DJANGO_SECRET_KEY=your-very-secure-secret-key-here
flyctl secrets set KHOJ_ADMIN_EMAIL=your-admin@email.com
flyctl secrets set KHOJ_ADMIN_PASSWORD=your-secure-admin-password

# AI Model APIs (set the ones you plan to use)
flyctl secrets set OPENAI_API_KEY=sk-your-openai-key
flyctl secrets set ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
flyctl secrets set GEMINI_API_KEY=your-gemini-key

# Optional: Enhanced web search
flyctl secrets set SERPER_DEV_API_KEY=your-serper-key
flyctl secrets set OLOSTEP_API_KEY=your-olostep-key

# Optional: Terrarium
flyctl secrets set E2B_API_KEY=your-e2b-key

# Optional: Local AI models
flyctl secrets set OPENAI_BASE_URL=https://your-local-ai-endpoint.com
flyctl secrets set KHOJ_DEFAULT_CHAT_MODEL=gpt-4

# Optional: Computer control (set to True if you want this feature)
flyctl secrets set KHOJ_OPERATOR_ENABLED=False

# Optional: Domain and HTTPS configuration
flyctl secrets set KHOJ_DOMAIN=your-khoj-app.fly.dev
flyctl secrets set KHOJ_ALLOWED_DOMAIN=your-khoj-app.fly.dev
flyctl secrets set KHOJ_NO_HTTPS=False

# Optional: Disable telemetry
flyctl secrets set KHOJ_TELEMETRY_DISABLE=True
```

### 4. Verify Configuration

Check that your `fly.toml` file is configured correctly:

```toml
# fly.toml
app = "your-app-name"
primary_region = "dfw"

[build]

[env]
  PORT = "8080"
  POSTGRES_PORT = "5432"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 1024

[mounts]
  source = "khoj_data"
  destination = "/root/.khoj"
```

### 5. Deploy the Application

```bash
# Deploy to Fly.io
flyctl deploy

# Monitor the deployment
flyctl logs

# Check the status
flyctl status
```

### 6. Access Your Application

Once deployed, your Khoj server will be available at:
- `https://your-app-name.fly.dev`

## Configuration Details

### Dockerfile Optimizations

The Dockerfile is optimized for Fly.io deployment:

- Uses the official Khoj image as base
- Configures proper port binding
- Sets up volume mounts for persistent data
- Includes health checks
- Optimized for production use

### Fly.toml Configuration

Key configuration options:

- **Port:** Application runs on port 8080 (Fly.io standard)
- **HTTPS:** Forced for security
- **Auto-scaling:** Machines start/stop based on demand
- **Region:** Choose based on your user base
- **Resources:** 1 CPU, 1GB RAM (adjust as needed)
- **Volumes:** Persistent storage for Khoj data

### Environment Variables

**Required:**
- `POSTGRES_*` - Database connection details
- `KHOJ_DJANGO_SECRET_KEY` - Django secret key
- `KHOJ_ADMIN_EMAIL` - Admin user email
- `KHOJ_ADMIN_PASSWORD` - Admin user password
- At least one AI API key (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `GEMINI_API_KEY`)

**Optional:**
- `SERPER_DEV_API_KEY` - Enhanced web search
- `OLOSTEP_API_KEY` - Web search capabilities
- `E2B_API_KEY` - Code execution environment
- `KHOJ_OPERATOR_ENABLED` - Computer control features
- `KHOJ_DOMAIN` - Custom domain configuration
- `KHOJ_TELEMETRY_DISABLE` - Disable usage analytics

## Scaling and Performance

### Resource Requirements

**Minimum:**
- 1 CPU, 1GB RAM
- 10GB persistent storage

**Recommended for production:**
- 2 CPUs, 2GB RAM
- 20GB+ persistent storage

### Scaling Configuration

Update your `fly.toml` for higher traffic:

```toml
[[vm]]
  cpu_kind = "shared"
  cpus = 2
  memory_mb = 2048

[http_service]
  min_machines_running = 1  # Keep at least 1 machine running
  max_machines_running = 3  # Scale up to 3 machines
```

### Performance Optimization

1. **Enable caching:**
   ```bash
   flyctl secrets set KHOJ_CACHE_TYPE=redis
   ```

2. **Use a CDN for static assets:**
   - Configure through Fly.io dashboard
   - Or use external CDN service

3. **Database optimization:**
   - Use Supabase connection pooling
   - Enable read replicas for high traffic

## Monitoring and Maintenance

### Viewing Logs

```bash
# Real-time logs
flyctl logs

# Filtered logs
flyctl logs --app your-app-name

# Export logs for analysis
flyctl logs --app your-app-name > khoj-logs.txt
```

### Health Checks

Monitor your application health:

```bash
# Check application status
flyctl status

# Check machine status
flyctl machine list

# SSH into the machine for debugging
flyctl ssh console
```

### Updates and Deployments

```bash
# Update to latest Khoj version
flyctl deploy

# Rollback to previous version
flyctl releases

# Scale resources
flyctl scale count 2
flyctl scale memory 2048
```

## Security Considerations

1. **Environment Variables:**
   - Never commit secrets to version control
   - Use Fly.io secrets management
   - Rotate API keys regularly

2. **Network Security:**
   - HTTPS is enforced by default
   - Configure IP restrictions if needed
   - Use Fly.io's built-in DDoS protection

3. **Access Control:**
   - Change default admin credentials
   - Use strong passwords
   - Consider implementing SSO

## Cost Optimization

### Fly.io Pricing

- **Hobby plan:** $0/month with resource limits
- **Launch plan:** $29/month with better resources
- **Scale plan:** $199/month for production workloads

### Cost Optimization Tips

1. **Use auto-scaling:**
   - Set `min_machines_running = 0` for development
   - Use `auto_stop_machines = true`

2. **Optimize resources:**
   - Start with smaller machines
   - Monitor usage and scale as needed

3. **Volume storage:**
   - Use appropriate storage size
   - Clean up old data regularly

## Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   ```bash
   # Check database credentials
   flyctl secrets list
   
   # Test connection from machine
   flyctl ssh console
   psql -h your-db-host -U postgres -d postgres
   ```

2. **Application Won't Start:**
   ```bash
   # Check logs for errors
   flyctl logs
   
   # Check machine status
   flyctl machine list
   
   # Restart machine
   flyctl machine restart MACHINE_ID
   ```

3. **Out of Memory:**
   ```bash
   # Scale up memory
   flyctl scale memory 2048
   
   # Or upgrade machine type
   flyctl machine update MACHINE_ID --memory 2048
   ```

### Debug Commands

```bash
# SSH into running machine
flyctl ssh console

# Check environment variables
flyctl ssh console -C "env | grep KHOJ"

# Check disk usage
flyctl ssh console -C "df -h"

# Check process status
flyctl ssh console -C "ps aux"
```

## Support and Resources

- **Fly.io Documentation:** [fly.io/docs](https://fly.io/docs)
- **Khoj Documentation:** [docs.khoj.dev](https://docs.khoj.dev)
- **Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)
- **Fly.io Community:** [community.fly.io](https://community.fly.io)

## Next Steps

1. **Custom Domain:** Configure a custom domain for your Khoj instance
2. **Backup Strategy:** Set up automated backups for your Supabase database
3. **Monitoring:** Implement application monitoring and alerting
4. **CI/CD:** Set up automated deployments from your Git repository
5. **Load Testing:** Test your deployment under expected load

---

**Note:** This setup deploys only the Khoj server. The database is provided by Supabase, and the optional computer service is not included in this deployment. If you need the computer service, you'll need to set up a separate deployment or use a different hosting solution that supports VNC/remote desktop access.
