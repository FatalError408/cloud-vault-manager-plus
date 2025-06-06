
#!/usr/bin/env bash

set -e

echo "🚀 Cloud Vault Manager - Enhanced GitHub Pages Deployment Script"
echo "================================================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    echo "Please run this script from your project's root directory"
    exit 1
fi

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
echo "🔧 Setting up GitHub Pages deployment..."

# Ensure we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "⚠️  Warning: You're not on the main/master branch"
  echo "Current branch: $CURRENT_BRANCH"
  read -p "Do you want to continue? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
  fi
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  Warning: You have uncommitted changes"
  echo "Please commit or stash your changes before deploying"
  git status --porcelain
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the app
echo "🏗️  Building the application for production..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix the errors and try again."
  exit 1
fi

# Prepare files for GitHub Pages
echo "📄 Preparing files for GitHub Pages..."
# Create .nojekyll to prevent Jekyll processing
touch dist/.nojekyll

# Create 404.html for SPA routing
cp dist/index.html dist/404.html

# Debug output
echo "🔍 Build verification:"
echo "Files in dist/:"
ls -la dist/ | head -10
echo "JavaScript files found: $(find dist -name "*.js" -type f | wc -l)"
echo "CSS files found: $(find dist -name "*.css" -type f | wc -l)"

# Backup current branch
ORIGINAL_BRANCH=$CURRENT_BRANCH

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
  echo "🌿 gh-pages branch exists, switching to it..."
  git checkout gh-pages
  # Remove all files except .git and dist
  find . -maxdepth 1 ! -name '.git' ! -name 'dist' ! -name '.' -exec rm -rf {} + 2>/dev/null || true
else
  echo "🌿 Creating new gh-pages branch..."
  git checkout --orphan gh-pages
  # Remove all files from the new orphan branch except dist
  git rm -rf . 2>/dev/null || true
  # Clear any remaining files except .git and dist
  find . -maxdepth 1 ! -name '.git' ! -name 'dist' ! -name '.' -exec rm -rf {} + 2>/dev/null || true
fi

# Copy built files to root
echo "📋 Copying built files to gh-pages branch..."
cp -r dist/* . 2>/dev/null || true
cp dist/.nojekyll . 2>/dev/null || true

# Clean up dist directory
rm -rf dist

# Commit and push
echo "💾 Committing changes to gh-pages..."
git add .
git commit -m "🚀 Deploy Cloud Vault Manager to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')" || {
  echo "ℹ️  No changes to commit - deployment is up to date"
}

echo "🚀 Pushing to gh-pages branch..."
git push origin gh-pages --force

# Switch back to original branch
echo "🔄 Switching back to $ORIGINAL_BRANCH branch..."
git checkout $ORIGINAL_BRANCH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. 🔗 Visit: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. 📋 Under 'Source', select 'Deploy from a branch'"
echo "3. 🌿 Under 'Branch', select 'gh-pages' and '/ (root)' then save"
echo "4. ⏰ Wait 2-5 minutes for deployment to complete"
echo ""
echo "🌐 Your app will be available at: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "💡 Pro tip: Use GitHub Actions for automatic deployment on every push!"
echo "   The .github/workflows/deploy.yml file is already configured for this."
echo ""
echo "🎉 Happy deploying!"

