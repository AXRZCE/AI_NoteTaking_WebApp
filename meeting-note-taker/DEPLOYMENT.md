# Deployment Guide for Meeting Note Taker

This document provides instructions for deploying the Meeting Note Taker application to various platforms.

## GitHub Pages Deployment

The project is already configured for GitHub Pages deployment. Follow these steps:

1. Create a GitHub repository for the project (if not already done)
2. Update the `homepage` field in `package.json` to match your GitHub username:
   ```json
   "homepage": "https://your-username.github.io/meeting-note-taker"
   ```
3. Push your code to the GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/meeting-note-taker.git
   git push -u origin main
   ```
4. Deploy the application to GitHub Pages:
   ```bash
   npm run deploy
   ```
5. Go to your GitHub repository settings, navigate to the "Pages" section, and ensure the site is being built from the "gh-pages" branch.
6. Your application should now be available at `https://your-username.github.io/meeting-note-taker`

## Netlify Deployment

To deploy to Netlify:

1. Create a Netlify account if you don't have one
2. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Build the application:
   ```bash
   npm run build
   ```
4. Deploy to Netlify:
   ```bash
   netlify deploy
   ```
5. Follow the prompts to create a new site or select an existing one
6. When asked for the publish directory, enter `dist`
7. Preview the deployment and if everything looks good, deploy to production:
   ```bash
   netlify deploy --prod
   ```

## Vercel Deployment

To deploy to Vercel:

1. Create a Vercel account if you don't have one
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy to Vercel:
   ```bash
   vercel
   ```
4. Follow the prompts to set up your project
5. When asked for the output directory, enter `dist`
6. Your application will be deployed to a Vercel URL

## Post-Deployment Tasks

After deploying to any platform:

1. Test the deployed application thoroughly using the TESTING.md checklist
2. Take screenshots of the deployed application for documentation
3. Update the README.md with the correct deployment URL
4. Share the URL with stakeholders for feedback

## Troubleshooting

### GitHub Pages Issues

- If assets are not loading, ensure the `base` path in `vite.config.js` matches your repository name
- Check that the `homepage` field in `package.json` is correct

### Netlify/Vercel Issues

- If you encounter routing issues, you may need to add a `_redirects` file or `vercel.json` configuration
- For Netlify, add a file called `_redirects` in the `public` directory with:
  ```
  /* /index.html 200
  ```
- For Vercel, create a `vercel.json` file in the root directory with:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

## Continuous Deployment

For automatic deployments when you push changes:

- GitHub Pages: Set up a GitHub Action workflow
- Netlify/Vercel: Connect your GitHub repository to your Netlify/Vercel project
