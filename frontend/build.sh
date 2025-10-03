#!/bin/bash
# Install dependencies
npm install
# Build the Next.js app
npm run build
# Create index.html in the root directory
cp out/index.html out/404.html

