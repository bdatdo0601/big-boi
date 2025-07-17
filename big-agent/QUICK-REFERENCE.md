# Khoj Server - Fly.io Quick Reference

## Essential Commands

### Initial Setup
```bash
# Install Fly.io CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
flyctl auth login

# Initialize app
flyctl launch --no-deploy

# Set secrets
flyctl secrets set KEY=value

# Create volume
flyctl volumes create khoj_data --size 10
```

### Deployment
```bash
# Deploy
flyctl deploy

# Monitor logs
flyctl logs

# Check status
flyctl status
```

### Management
```bash
# Scale resources
flyctl scale memory 2048
flyctl scale count 2

# SSH into machine
flyctl ssh console

# Restart machine
flyctl machine restart MACHINE_ID

# Update configuration
flyctl deploy
```

### Monitoring
```bash
# View logs
flyctl logs --app your-app-name

# Check machines
flyctl machine list

# View releases
flyctl releases

# Monitor resource usage
flyctl ssh console -C "top"
```

## Environment Variables Quick Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_HOST` | Yes | Supabase database host |
| `POSTGRES_PASSWORD` | Yes | Database password |
| `KHOJ_DJANGO_SECRET_KEY` | Yes | Django secret key |
| `KHOJ_ADMIN_EMAIL` | Yes | Admin email |
| `KHOJ_ADMIN_PASSWORD` | Yes | Admin password |
| `OPENAI_API_KEY` | Yes* | OpenAI API key |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API key |
| `GEMINI_API_KEY` | Yes* | Google Gemini API key |
| `SERPER_DEV_API_KEY` | No | Web search API |
| `E2B_API_KEY` | No | Code execution API |
| `KHOJ_TELEMETRY_DISABLE` | No | Disable telemetry |

*At least one AI API key is required

## Troubleshooting

### App Won't Start
```bash
flyctl logs
flyctl machine list
flyctl machine restart MACHINE_ID
```

### Database Connection Issues
```bash
flyctl secrets list
flyctl ssh console
psql -h your-db-host -U postgres -d postgres
```

### Performance Issues
```bash
flyctl scale memory 2048
flyctl machine update MACHINE_ID --memory 2048
```

### Rollback
```bash
flyctl releases
flyctl rollback
```

## URLs and Access

- **Application:** `https://your-app-name.fly.dev`
- **Admin:** `https://your-app-name.fly.dev/admin`
- **API:** `https://your-app-name.fly.dev/api`
- **Health:** `https://your-app-name.fly.dev/health`

## Configuration Files

- `fly.toml` - Fly.io configuration
- `Dockerfile` - Container configuration
- `.env.example` - Environment variables template
- `.dockerignore` - Docker build exclusions

## Support

- **Fly.io Docs:** https://fly.io/docs
- **Khoj Docs:** https://docs.khoj.dev
- **Supabase Docs:** https://supabase.com/docs
- **Community:** https://community.fly.io
