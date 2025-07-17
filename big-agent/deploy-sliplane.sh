#!/bin/bash

# Sliplane Deployment Script for Khoj AI
# This script helps prepare and deploy your Khoj application to Sliplane

set -e

echo "🚀 Khoj AI - Sliplane Deployment Preparation"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Please run this script from the big-agent directory."
    exit 1
fi

print_status "Checking prerequisites..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_status "Created .env file. Please edit it with your configuration."
fi

# Check if Docker is installed (for local testing)
if command -v docker &> /dev/null; then
    print_status "Docker is installed ✓"
else
    print_warning "Docker not found. You can still deploy to Sliplane, but local testing won't work."
fi

# Check if git is configured
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_status "Git repository detected ✓"
else
    print_error "This doesn't appear to be a git repository. Sliplane needs a git repository to deploy."
    exit 1
fi

# Generate a random Django secret key if not set
if grep -q "change-this-secret-key" .env; then
    print_warning "Django secret key needs to be updated in .env file"
    # Generate a random secret key
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))" 2>/dev/null || openssl rand -base64 50 | tr -d "=+/" | cut -c1-50)
    sed -i.bak "s/change-this-secret-key-to-something-random-minimum-50-characters/${SECRET_KEY}/" .env
    print_status "Generated random Django secret key"
fi

print_status "Validating environment configuration..."

# Check for required environment variables
required_vars=("KHOJ_ADMIN_EMAIL" "KHOJ_ADMIN_PASSWORD" "KHOJ_DJANGO_SECRET_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=.*change-this" .env || grep -q "^${var}=.*example" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "The following required environment variables need to be configured in .env:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo ""
    print_warning "Please edit .env file and update these variables before deploying."
    exit 1
fi

# Check if at least one AI API key is configured
ai_keys=("ANTHROPIC_API_KEY" "OPENAI_API_KEY" "GEMINI_API_KEY")
has_ai_key=false

for key in "${ai_keys[@]}"; do
    if grep -q "^${key}=" .env && ! grep -q "^${key}=.*your_.*_api_key" .env; then
        has_ai_key=true
        break
    fi
done

if [ "$has_ai_key" = false ]; then
    print_warning "No AI API keys found in .env. You'll need to configure at least one:"
    echo "  - ANTHROPIC_API_KEY (recommended)"
    echo "  - OPENAI_API_KEY"
    echo "  - GEMINI_API_KEY"
    echo ""
    print_warning "You can add these later in Sliplane dashboard."
fi

print_status "Testing local Docker Compose setup..."

# Test if docker-compose runs without errors
if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
    if timeout 30 docker-compose config > /dev/null 2>&1; then
        print_status "Docker Compose configuration is valid ✓"
    else
        print_error "Docker Compose configuration has errors. Please check your docker-compose.yml"
        exit 1
    fi
else
    print_warning "Cannot test Docker Compose locally (Docker not available)"
fi

print_status "Checking git status..."

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Consider committing them before deploying."
    echo "Uncommitted files:"
    git status --porcelain
    echo ""
fi

# Check current branch
current_branch=$(git branch --show-current)
print_status "Current branch: $current_branch"

echo ""
print_status "Pre-deployment checklist complete!"
echo ""
echo "📋 Next steps for Sliplane deployment:"
echo ""
echo "1. 🌐 Go to https://sliplane.io and sign up with GitHub"
echo "2. 🔗 Connect your repository containing this project"
echo "3. ⚙️  Configure environment variables in Sliplane dashboard:"
echo "   - Copy variables from your .env file"
echo "   - Set production values (KHOJ_DEBUG=False, etc.)"
echo "4. 🚀 Deploy your application"
echo "5. ✅ Access your Khoj AI at https://your-app-name.sliplane.app"
echo ""
echo "📚 See SLIPLANE_DEPLOYMENT.md for detailed instructions."
echo ""
echo "💡 Tips:"
echo "   - Start with a small server size and scale up if needed"
echo "   - Monitor your application in Sliplane dashboard"
echo "   - Check logs if deployment fails"
echo ""
print_status "Good luck with your deployment! 🎉"
