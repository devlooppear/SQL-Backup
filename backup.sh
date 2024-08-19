#!/bin/bash

# Define variables
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/sqlbackups_${DATE}.sql"

# Create the backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Command to dump the database
docker exec mysql_db /usr/bin/mysqldump -uuser -ppassword sqlbackups > "${BACKUP_FILE}"

echo "Backup created at ${BACKUP_FILE}"
