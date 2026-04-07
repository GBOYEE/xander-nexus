#!/bin/bash
set -e

echo "=== Xander Nexus Server Setup ==="

# 1. Ensure Node.js and npm are available
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Please install Node.js 20+ first."
  exit 1
fi

# 2. Move project to /opt if not already there
if [ ! -d "/opt/xander-nexus" ]; then
  echo "Moving xander-nexus to /opt..."
  mv /root/.openclaw/workspace/xander-nexus /opt/
fi

cd /opt/xander-nexus

# 3. Install npm dependencies (including playwright)
echo "Installing npm dependencies..."
npm install

# 4. Install Playwright browsers and Linux dependencies
echo "Installing Playwright browsers and dependencies..."
npx playwright install-deps chromium
npx playwright install chromium

# 5. Create data directory
mkdir -p data

# 6. Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/xander-nexus.service << 'SERV'
[Unit]
Description=Xander Nexus
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/xander-nexus
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
SERV

systemctl daemon-reload
systemctl enable xander-nexus
systemctl start xander-nexus

echo "=== Setup complete ==="
echo "Xander Nexus is running on port 3000"
echo "Use SSH tunnel: ssh -L 3000:localhost:3000 user@207.180.223.192"
echo "Then open http://localhost:3000/dashboard"
