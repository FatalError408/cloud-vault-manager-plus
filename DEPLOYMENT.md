
# Cloud Vault Manager - Deployment Guide

## Automatic Deployment with GitHub Actions

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository settings: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/pages`
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Deploy setup"
   git push origin main
   ```

3. **Automatic Deployment**:
   - Every push to the `main` branch will trigger an automatic deployment
   - Check the "Actions" tab to monitor deployment progress
   - Your app will be available at: `https://YOUR_USERNAME.github.io/CloudVaultManager/`

## Manual Deployment

### Using the Deploy Script

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Manual Steps

1. **Build the project**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to gh-pages branch**:
   ```bash
   # Create and switch to gh-pages branch
   git checkout -b gh-pages
   
   # Copy build files
   cp -r dist/* .
   cp dist/.nojekyll .
   cp dist/index.html 404.html
   
   # Commit and push
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages --force
   
   # Switch back to main
   git checkout main
   ```

## Important Configuration

### Google OAuth Setup

Make sure your Google Cloud Console has the correct settings:

- **Authorized JavaScript origins**: `https://YOUR_USERNAME.github.io`
- **Authorized redirect URIs**: `http://localhost:8080` (for development)

### Vite Configuration

The `vite.config.ts` is already configured with:
- Base path: `/CloudVaultManager/`
- Proper build settings for GitHub Pages

## Troubleshooting

### Common Issues

1. **404 on page refresh**: The `404.html` file handles SPA routing
2. **Google OAuth not working**: Check the authorized origins in Google Cloud Console
3. **Assets not loading**: Ensure the base path in `vite.config.ts` matches your repository name

### Debug Deployment

Check the GitHub Actions logs:
1. Go to the "Actions" tab in your repository
2. Click on the latest workflow run
3. Expand the steps to see detailed logs

## Support

If you encounter issues, check:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

