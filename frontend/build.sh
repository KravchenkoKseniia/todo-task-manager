#!/bin/bash
# Install dependencies
npm install
# Build the Next.js app
npm run build
# Create a temporary file to help Render detect the site's structure
touch out/.nojekyll
