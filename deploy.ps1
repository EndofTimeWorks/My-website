# Step 1: Install Dependencies
Write-Output "Installing dependencies..."
npm install

# Step 2: Build Frontend
Write-Output "Building the React project..."
npm run build

# Step 3: Deploy Frontend to Cloudflare Pages
Write-Output "Deploying frontend to Cloudflare Pages..."
wrangler pages deploy ./build --project-name personal-site-test

# Step 4: Deploy Backend to Cloudflare Workers
Write-Output "Deploying backend worker..."
wrangler deploy spotify-worker.js --name spotify-worker

Write-Output "✅ Deployment complete! Frontend and backend are live."
