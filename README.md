# Personal Website with Cloudflare Integration

## 🏗️ Architecture Overview

This project implements a modern web application architecture leveraging Cloudflare's edge computing capabilities. The architecture consists of three primary components:

1. **React Frontend**: A Single Page Application (SPA) built with Create React App
2. **Cloudflare Workers**: Serverless functions handling API integrations
3. **Cloudflare Pages**: Static site hosting with global CDN distribution

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- Cloudflare account
- Spotify Developer account
- Git

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/EndofTimee/My-website
cd personal-website
```

2. Create a `.env` file in the root directory:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=your_redirect_uri
```

3. Install dependencies:
```bash
npm install
```

## 💻 Local Development

### Starting the Development Server

```bash
# Start React development server
npm start

# In a separate terminal, start the Cloudflare Worker
npx wrangler dev spotify-worker.js
```

The application will be available at:
- Frontend: http://localhost:3000
- Worker: http://localhost:8787

### Component Structure

The project follows a modular component structure:

```
src/
├── components/
│   ├── SpotifyList/          # Spotify integration
│   ├── GithubRepos/          # GitHub repository display
│   ├── LoadingAnimation/     # Loading states
│   └── ParallaxEffect/       # Visual effects
├── App.js                    # Main application component
└── index.js                  # Application entry point
```

## 🌐 Deployment

### Automated Deployment

The project includes a PowerShell deployment script that handles both frontend and worker deployment:

```bash
npm run deploy
```

This script:
1. Loads environment variables
2. Installs dependencies
3. Builds the React application
4. Deploys to Cloudflare Pages
5. Deploys the Spotify Worker
6. Sets up environment secrets

### Manual Deployment Steps

If you need to deploy components individually:

1. Frontend Deployment:
```bash
npm run build
npx wrangler pages deploy ./build
```

2. Worker Deployment:
```bash
npx wrangler deploy spotify-worker.js
```

### Environment Configuration

#### Cloudflare Pages Configuration:

1. Build settings:
   - Build command: `npm run build`
   - Build output directory: `build`
   - Node.js version: 16 (or higher)

2. Environment variables:
   - Production branch: `main`
   - Preview branches: `dev/*`

#### Worker Configuration:

Required environment secrets:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI`

## 🐛 Troubleshooting

### Common Issues

1. Worker Deployment Failures:
   ```bash
   # Verify wrangler.toml configuration
   npx wrangler config
   
   # Check worker status
   npx wrangler tail
   ```

2. Build Issues:
   ```bash
   # Clear dependency cache
   rm -rf node_modules
   npm clean-cache --force
   npm install
   ```

3. Environment Variables:
   ```bash
   # Verify environment variables
   npx wrangler secret list
   ```

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.