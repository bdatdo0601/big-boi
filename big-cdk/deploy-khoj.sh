#!/bin/bash

# Khoj CDK Deployment Script
# This script deploys the Khoj application to AWS using CDK

set -e

echo "🚀 Starting Khoj CDK deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if CDK is bootstrapped
echo "📦 Checking CDK bootstrap status..."
if ! aws cloudformation describe-stacks --stack-name CDKToolkit > /dev/null 2>&1; then
    echo "⚠️  CDK not bootstrapped. Bootstrapping now..."
    npx cdk bootstrap
else
    echo "✅ CDK already bootstrapped"
fi

# Build the project
echo "🔨 Building CDK project..."
rm -rf cdk.out
npm run build

# Synthesize the CloudFormation template
echo "🔍 Synthesizing CloudFormation template..."
npx cdk synth KhojStack

# Deploy the stack
echo "🚀 Deploying KhojStack..."
npx cdk deploy KhojStack --require-approval never

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the ANTHROPIC_API_KEY in the task definition with your actual API key"
echo "2. Consider storing sensitive values in AWS Secrets Manager"
echo "3. Update the admin email and password in the environment variables"
echo "4. For production use, enable deletion protection on the database"
echo ""
echo "🔗 Access your Khoj application at the LoadBalancer DNS name shown in the outputs above"
