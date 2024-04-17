#!/bin/sh
echo $ENVIRONMENT

if [ $ENVIRONMENT = "main" ]; then
    echo "Running production setup..."
    npm run build 
else
    echo "Running staging setup..."
    npm run build -- --mode staging
fi
