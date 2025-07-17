# Dockerfile for Khoj server application
FROM ghcr.io/khoj-ai/khoj:latest

# Set working directory
WORKDIR /app

# Environment variables with defaults
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_HOST=database
ENV POSTGRES_PORT=5432

# Khoj configuration
ENV KHOJ_DJANGO_SECRET_KEY=your-secret-key-change-this
ENV KHOJ_DEBUG=False
ENV KHOJ_ADMIN_EMAIL=admin@example.com
ENV KHOJ_ADMIN_PASSWORD=change-this-password

# Optional: Computer control
ENV KHOJ_OPERATOR_ENABLED=False

# Optional: Disable telemetry
ENV KHOJ_TELEMETRY_DISABLE=False

# Optional: HTTPS and domain configuration
ENV KHOJ_NO_HTTPS=False

# Railway-specific: Port configuration
ENV PORT=42110

# Expose the application port
EXPOSE 42110

# Add extra hosts for host.docker.internal (this will need to be handled at runtime)
# This is typically done with --add-host flag during docker run

# Set restart policy metadata (for documentation)
LABEL restart.policy="unless-stopped"
LABEL service.name="server"
LABEL service.description="Khoj server application"

# Default command
CMD ["--host=0.0.0.0", "--port=42110", "-vv", "--non-interactive"]
