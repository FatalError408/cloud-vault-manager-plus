
#!/usr/bin/env bash

# Build the app
npm run build

# Create a .nojekyll file to prevent Jekyll processing
touch dist/.nojekyll

# If using a custom domain, create CNAME file
# echo "yourdomain.com" > dist/CNAME

# Initialize git in the dist folder
cd dist
git init
git add .
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch - REPLACE these with your actual GitHub username and repository name
git push -f https://github.com/your-username/cloud-vault-manager.git main:gh-pages

cd ..
echo "Deployed to GitHub Pages!"
