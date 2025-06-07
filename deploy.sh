
#!/usr/bin/env bash

# Exit on error
set -e

# Get the username from the user if not already set
if [ -z "$GITHUB_USERNAME" ]; then
  echo "Enter your GitHub username:"
  read GITHUB_USERNAME
fi

# Get the repository name from the user if not already set
if [ -z "$REPO_NAME" ]; then
  echo "Enter your repository name (default: cloud-vault-manager):"
  read REPO_NAME
  REPO_NAME=${REPO_NAME:-cloud-vault-manager}
fi

echo "Deploying to GitHub Pages under $GITHUB_USERNAME/$REPO_NAME..."

# Build the app
echo "Building the application..."
npm run build

# Create necessary files for GitHub Pages
echo "Preparing files for GitHub Pages..."
touch dist/.nojekyll
# If using a custom domain, uncomment the next line and replace with your domain
# echo "yourdomain.com" > dist/CNAME

# Initialize git in the dist folder
echo "Initializing git repository in the dist folder..."
cd dist
git init
git add .
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch
echo "Pushing to gh-pages branch..."
git push -f https://github.com/$GITHUB_USERNAME/$REPO_NAME.git main:gh-pages

cd ..
echo "Deployment complete! Your site should be available at:"
echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "IMPORTANT: Make sure to activate GitHub Pages in your repository settings:"
echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Under 'Branch', select 'gh-pages' and save"
echo ""
echo "It may take a few minutes for your site to be available."
