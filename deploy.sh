
#!/usr/bin/env bash

set -e

echo "🚀 Cloud Vault Manager - GitHub Pages Deployment Script"
echo "======================================================="

# Get repository info from git
REPO_URL=$(git config --get remote.origin.url)
if [[ $REPO_URL == *"github.com"* ]]; then
  if [[ $REPO_URL == *".git" ]]; then
    REPO_URL=${REPO_URL%.git}
  fi
  GITHUB_USERNAME=$(echo $REPO_URL | sed 's/.*github.com[:/]\([^/]*\).*/\1/')
  REPO_NAME=$(echo $REPO_URL | sed 's/.*\/\([^/]*\)$/\1/')
else
  echo "❌ Not a GitHub repository or unable to detect repository info"
  exit 1
fi

echo "📍 Detected repository: $GITHUB_USERNAME/$REPO_NAME"
echo "🏗️  Building for GitHub Pages deployment..."

# Build the app
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix the errors and try again."
  exit 1
fi

# Create necessary files for GitHub Pages
echo "📄 Preparing files for GitHub Pages..."
touch dist/.nojekyll

# Debug output
echo "🔍 Build verification:"
echo "Files in dist/:"
ls -la dist/
echo "Content of dist/index.html (first 20 lines):"
head -20 dist/index.html
echo "JavaScript files:"
find dist -name "*.js" -type f | head -5
echo "CSS files:"
find dist -name "*.css" -type f | head -5

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
  echo "🌿 gh-pages branch exists, switching to it..."
  git checkout gh-pages
  # Remove all files except .git
  find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +
else
  echo "🌿 Creating new gh-pages branch..."
  git checkout --orphan gh-pages
  # Remove all files from the new orphan branch
  git rm -rf . 2>/dev/null || true
fi

# Copy built files
echo "📋 Copying built files..."
cp -r dist/* .
cp dist/.nojekyll .

# Commit and push
echo "💾 Committing changes..."
git add .
git commit -m "Deploy Cloud Vault Manager to GitHub Pages - $(date)" || echo "No changes to commit"

echo "🚀 Pushing to gh-pages branch..."
git push origin gh-pages --force

# Switch back to main
git checkout main

echo ""
echo "✅ Deployment complete! Your site will be available at:"
echo "🌐 https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "⚠️  IMPORTANT: Make sure GitHub Pages is enabled:"
echo "1. 🔗 Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. 📋 Under 'Source', select 'Deploy from a branch'"
echo "3. 🌿 Under 'Branch', select 'gh-pages' and '/ (root)' then save"
echo ""
echo "⏰ It may take a few minutes for your site to be available."
echo "🎉 Happy deploying!"
