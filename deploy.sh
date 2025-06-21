#!/bin/bash

echo "🚀 StreamHib Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
print_status "Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install PM2
print_status "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
sudo apt install nginx -y

# Setup database
print_status "Setting up database..."
echo "Please enter database password for streamhib_user:"
read -s DB_PASSWORD

sudo -u postgres psql << EOF
CREATE DATABASE streamhib;
CREATE USER streamhib_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE streamhib TO streamhib_user;
\q
EOF

# Install dependencies
print_status "Installing project dependencies..."
npm install

cd backend
npm install
cd ..

# Setup environment
print_status "Setting up environment variables..."
cd backend
cp .env.example .env

print_warning "Please edit backend/.env file with your configuration:"
print_warning "- Database password: $DB_PASSWORD"
print_warning "- JWT secret"
print_warning "- Email credentials"
print_warning "- Midtrans keys"
print_warning "- Hetzner API token"
print_warning "- Frontend URL"

echo "Press Enter when you've finished editing .env file..."
read

# Build frontend
print_status "Building frontend..."
cd ..
npm run build

# Setup database tables
print_status "Setting up database tables..."
cd backend
node -e "
require('dotenv').config();
const { sequelize } = require('./models');
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced!');
  process.exit(0);
}).catch(err => {
  console.error('Database sync failed:', err);
  process.exit(1);
});
"

# Start services
print_status "Starting services with PM2..."
pm2 start app.js --name "streamhib-backend"
cd ..
pm2 serve out 3000 --name "streamhib-frontend"
pm2 save
pm2 startup

print_status "Setup Nginx configuration..."
echo "Please enter your domain name (or IP address):"
read DOMAIN

sudo tee /etc/nginx/sites-available/streamhib > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/streamhib /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

print_status "Deployment completed!"
print_status "Your StreamHib application is now running at: http://$DOMAIN"
print_warning "Don't forget to:"
print_warning "1. Configure your domain DNS"
print_warning "2. Setup SSL certificate with: sudo certbot --nginx -d $DOMAIN"
print_warning "3. Test the payment flow"
print_warning "4. Setup monitoring and backups"

echo ""
print_status "Useful commands:"
echo "- Check logs: pm2 logs"
echo "- Restart services: pm2 restart all"
echo "- Check status: pm2 status"
echo "- Nginx logs: sudo tail -f /var/log/nginx/error.log"