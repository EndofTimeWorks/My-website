# Personal Website with Cloudflare Integration

## 🏗️ Architecture Overview

This project implements a modern web application architecture leveraging Cloudflare's edge computing capabilities. The architecture consists of two primary components:

1. **React Frontend**: A Single Page Application (SPA) built with React and TypeScript
2. **Cloudflare Pages**: Static site hosting with global CDN distribution

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- Cloudflare account
- Last.fm account and API key
- Git

### API Keys Setup

1. **Last.fm API Key**:
   - Visit [Last.fm API Account Creation](https://www.last.fm/api/account/create)
   - Sign in with your Last.fm account
   - Fill in the application details
   - Save your API key
   - Your username can be found in your profile URL: last.fm/user/YOUR_USERNAME

2. **Cloudflare Setup**:
   - Create an account at [Cloudflare](https://dash.cloudflare.com/sign-up)
   - Get your Account ID from the dashboard
   - Create an API token with Pages deployment permissions

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/EndofTimee/personal-site
cd personal-site
```

2. Create a `.env` file in the root directory:
```env
VITE_LASTFM_API_KEY=your_lastfm_api_key
VITE_LASTFM_USERNAME=your_lastfm_username
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

3. Install dependencies:
```bash
npm install
```

## 💻 Local Development

Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

### Component Structure

The project follows a modular component structure:

```
src/
├── components/
│   ├── LastFMTrack/       # Music integration
│   ├── GithubRepos/       # GitHub repository display
│   ├── LoadingFox/        # Loading states
│   └── ParallaxEffect/    # Visual effects
├── App.tsx                # Main application component
└── index.tsx             # Application entry point
```

## 🌐 Deployment

### Automated Deployment

The project includes a PowerShell deployment script:

```bash
npm run deploy
```

This script:
1. Loads environment variables
2. Installs dependencies
3. Builds the React application
4. Deploys to Cloudflare Pages
5. Sets up environment secrets

### Manual Deployment Steps

If you need to deploy manually:

```bash
npm run build
npx wrangler pages deploy ./dist
```

### Environment Configuration

#### Cloudflare Pages Configuration:

1. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 16 (or higher)

2. Environment variables:
   - Production branch: `main`
   - Preview branches: `dev/*`

## 🐛 Troubleshooting

### Common Issues

1. Build Issues:
   ```bash
   # Clear dependency cache
   rm -rf node_modules
   npm clean-cache --force
   npm install
   ```

2. Environment Variables:
   ```bash
   # Verify environment variables
   npx wrangler secret list
   ```

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Last.fm API Documentation](https://www.last.fm/api)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details