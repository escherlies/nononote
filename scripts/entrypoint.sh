#!/bin/sh

# Remove all files in the web server directory
echo "Removing all files in the web server directory..."
rm -fr "/var/www/nononote/*"

# Copy the build files to the web server directory
echo "Copying the build files to the web server directory..."
cp -r /app/client/build/* /var/www/nononote/
