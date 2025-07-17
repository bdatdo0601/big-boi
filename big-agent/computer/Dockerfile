# NOT IN USE
# Dockerfile for Khoj Computer service (optional)
FROM ghcr.io/khoj-ai/khoj-computer:latest

# Expose VNC port for remote access
EXPOSE 5900

# Set restart policy metadata (for documentation)
LABEL restart.policy="unless-stopped"
LABEL service.name="computer"
LABEL service.description="Creates Computer for Khoj to use"

# Note: This service is optional and requires KHOJ_OPERATOR_ENABLED=True
# in the server service environment variables to be enabled.

# The base image already handles the entrypoint and user setup
# Data will be stored in /home/operator
