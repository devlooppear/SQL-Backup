# SQL Backup 🗄️

This application demonstrates how to perform SQL database backups using both a CI/CD pipeline and scheduled tasks. It includes two methods for backup:

1. **CI/CD Pipeline**: Configured using GitHub Actions (`.github/workflows/backup.yml`).
2. **Scheduled Task**: Configured using a Node.js cron job (`src/server.ts`).

## Requirements 📋

Before getting started, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (with npm)

## Getting Started 🚀

### 1. Start the Application

Run the following command to start the application with Docker Compose:

```bash
docker-compose up
```

2. Configure Environment Variables
Copy the example environment file and edit it as needed:

```bash
cp .env.example .env
```

3. Install Dependencies
   In a new terminal, navigate to the project directory and install the dependencies:

```bash
npm install
```

4. Run the Application
   Start the application in development mode:

```bash
npm run dev
```

Backup Methods 🔄

1. CI/CD Pipeline
   Location: .github/workflows/backup.yml
   Description: This workflow automatically performs database backups using GitHub Actions. It is triggered by schedule or repository events as defined in the workflow file.
2. Scheduled Task
   Location: src/server.ts

Description: This script sets up a scheduled task using node-cron to run a backup command at a specified time. The backup script is executed daily at the time configured.

To change the backup schedule, update the BACKUP_SCHEDULE variable in src/server.ts to your desired cron expression. For example:

```typescript
const BACKUP_SCHEDULE = "0 13 * * *"; // Runs daily at 13:00 (1 PM) UTC
```

### Upgrading the Application (if you want LOL) ⬆️

To enhance the application, consider integrating cloud storage solutions for storing backup files:

Create a Cloud Storage Bucket: Set up a bucket in your preferred cloud storage service (e.g., AWS S3, Google Cloud Storage, Azure Blob Storage).

Update Backup Script: Modify backup.sh or the cron job script to upload the .sql backup files to your cloud storage bucket.

Configure Environment Variables: Add necessary credentials and configuration for cloud storage in your .env file.
