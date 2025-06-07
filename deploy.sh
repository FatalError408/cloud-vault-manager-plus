
#!/usr/bin/env bash

# Exit on error
set -e

echo "This script is now deprecated. Use GitHub Actions for automatic deployment."
echo ""
echo "To deploy automatically:"
echo "1. Push your changes to the main branch"
echo "2. GitHub Actions will automatically build and deploy to gh-pages"
echo ""
echo "Make sure GitHub Pages is configured:"
echo "1. Go to your repository settings"
echo "2. Navigate to Pages section"
echo "3. Set source to 'Deploy from a branch'"
echo "4. Select 'gh-pages' branch and '/ (root)' folder"
echo ""
echo "Your site will be available at: https://[username].github.io/[repository-name]/"
