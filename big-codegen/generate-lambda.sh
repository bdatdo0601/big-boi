#!/bin/bash

# Simple script to generate TypeScript Lambda functions
set -e

# Default values
LAMBDA_NAME=""
LAMBDA_DESCRIPTION=""

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_PATH="$PROJECT_ROOT/templates/typescript-lambda-cookiecutter"
LAMBDAS_PATH="$PROJECT_ROOT/lambdas"

show_usage() {
    cat << EOF
Usage: $0 --name LAMBDA_NAME [OPTIONS]

Options:
  --name NAME         Lambda function name (required)
  --desc DESCRIPTION  Lambda description (optional)
  --help             Show this help

Examples:
  $0 --name user-service
  $0 --name payment-api --desc "Payment processing API"
  $0 --name simple-lambda --no-commons
EOF
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --name)
            LAMBDA_NAME="$2"
            shift 2
            ;;
        --desc)
            LAMBDA_DESCRIPTION="$2"
            shift 2
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            echo "Error: Unknown option $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate required arguments
if [[ -z "$LAMBDA_NAME" ]]; then
    echo "Error: --name is required"
    show_usage
    exit 1
fi

# Set default description if not provided
if [[ -z "$LAMBDA_DESCRIPTION" ]]; then
    LAMBDA_DESCRIPTION="A TypeScript Lambda function"
fi

# Check if cookiecutter is installed
if ! command -v cookiecutter &> /dev/null; then
    echo "Installing cookiecutter..."
    if command -v uv &> /dev/null; then
        uv tool install cookiecutter
    else
        echo "Error: uv not found. Install uv first:"
        echo "curl -LsSf https://astral.sh/uv/install.sh | sh"
        exit 1
    fi
fi

# Validate paths
if [[ ! -d "$TEMPLATE_PATH" ]]; then
    echo "Error: Template not found at $TEMPLATE_PATH"
    exit 1
fi

if [[ ! -d "$LAMBDAS_PATH" ]]; then
    echo "Error: Lambdas directory not found at $LAMBDAS_PATH"
    exit 1
fi

# Generate lambda
echo "Generating $LAMBDA_NAME..."
cookiecutter "$TEMPLATE_PATH" \
    --output-dir "$LAMBDAS_PATH" \
    --no-input \
    "lambda_name=$LAMBDA_NAME" \
    "lambda_description=$LAMBDA_DESCRIPTION" \
    "author_name=Big Boi Developer" \
    "license=MIT"

echo "✅ Lambda generated at lambdas/$LAMBDA_NAME"
echo "Next: cd lambdas/$LAMBDA_NAME && npm install && npm run build"
