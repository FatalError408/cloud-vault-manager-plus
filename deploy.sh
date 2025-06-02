
#!/usr/bin/env bash

# Exit on error
set -e

echo "🚀 Cloud Vault Manager - GitHub Pages Deployment Script"
echo "======================================================="

# Get the username from the user if not already set
if [ -z "$GITHUB_USERNAME" ]; then
  echo "📝 Enter your GitHub username:"
  read GITHUB_USERNAME
fi

# Get the repository name from the user if not already set
if [ -z "$REPO_NAME" ]; then
  echo "📝 Enter your repository name (default: cloud-vault-manager):"
  read REPO_NAME
  REPO_NAME=${REPO_NAME:-cloud-vault-manager}
fi

echo "🏗️  Building for GitHub Pages deployment to $GITHUB_USERNAME/$REPO_NAME..."

# Create backup of original files
cp index.html index.html.backup
cp vite.config.ts vite.config.ts.backup

# Update the base href in index.html for GitHub Pages
echo "🔧 Updating base href for GitHub Pages..."
sed -i.bak "s|<base href=\"/cloud-vault-manager/\" />|<base href=\"/$REPO_NAME/\" />|g" index.html

# Update vite.config.ts base path
echo "🔧 Updating vite config base path..."
sed -i.bak "s|base: \"/cloud-vault-manager/\"|base: \"/$REPO_NAME/\"|g" vite.config.ts

# Build the app
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix the errors and try again."
  mv index.html.backup index.html
  mv vite.config.ts.backup vite.config.ts
  exit 1
fi

# Create necessary files for GitHub Pages
echo "📄 Preparing files for GitHub Pages..."
touch dist/.nojekyll

# Copy 404.html if it exists
if [ -f "404.html" ]; then
  cp 404.html dist/
  echo "✅ 404.html copied to dist/"
fi

# Debug output
echo "🔍 Build verification:"
echo "Files in dist/:"
ls -la dist/
echo "Content of dist/index.html (first 20 lines):"
head -20 dist/index.html

# Initialize git in the dist folder
echo "🌿 Initializing git repository in the dist folder..."
cd dist
git init
git checkout -b gh-pages
git add .
git commit -m "Deploy Cloud Vault Manager to GitHub Pages - $(date)"

# Force push to the gh-pages branch
echo "🚀 Pushing to gh-pages branch..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git 2>/dev/null || true
git push -f origin gh-pages

cd ..

# Restore original files
rm index.html
mv index.html.backup index.html
rm -f index.html.bak

rm vite.config.ts
mv vite.config.ts.backup vite.config.ts
rm -f vite.config.ts.bak

echo ""
echo "✅ Deployment complete! Your site will be available at:"
echo "🌐 https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "⚠️  IMPORTANT: Follow these steps to activate GitHub Pages:"
echo "1. 🔗 Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. 📋 Under 'Source', select 'Deploy from a branch'"
echo "3. 🌿 Under 'Branch', select 'gh-pages' and '/ (root)' then save"
echo ""
echo "🔐 ALSO IMPORTANT: Update your Google OAuth settings:"
echo "1. 🌐 Go to: Google Cloud Console -> APIs & Credentials -> OAuth 2.0 Client IDs"
echo "2. ➕ Add to 'Authorized JavaScript origins':"
echo "   - https://$GITHUB_USERNAME.github.io"
echo "3. ➕ Add to 'Authorized redirect URIs':"
echo "   - https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "⏰ It may take a few minutes for your site to be available."
echo "🎉 Happy deploying!"
