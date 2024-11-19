#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd backend && node server.js &

# Start frontend app
echo "Starting frontend application..."
cd my-problems-app && npm run start &

# Wait for all background processes
wait

# Error handling
if [ $? -ne 0 ]; then
    echo "An error occurred while running the applications"
    exit 1
fi