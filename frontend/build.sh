#!/bin/bash
# Install dependencies
npm install
# Build the Next.js app
npm run build
# Create a .nojekyll file to help with proper path resolution
touch out/.nojekyll

