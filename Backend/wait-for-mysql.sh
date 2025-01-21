#!/bin/bash

# Wait for MySQL to be ready
until mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e 'SELECT 1'; do
  echo "Waiting for MySQL to be ready..."
  sleep 5
done

echo "MySQL is ready. Starting the backend app..."

# Now run the backend app (pass any arguments that might come after this script)
exec "$@"
