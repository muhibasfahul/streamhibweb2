#!/bin/bash

echo "🚀 StreamHib Complete Installation Script"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

print_header "1. Updating system packages..."
apt update && apt upgrade -y

print_header "2. Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

print_header "3. Installing PostgreSQL..."
apt install postgresql postgresql-contrib -y
systemctl start postgresql
systemctl enable postgresql

print_header "4. Setting up PostgreSQL with your password..."
# Set postgres user password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Cawet3Sewu';"

# Configure PostgreSQL to allow password authentication
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf
sed -i "s/local   all             all                                     peer/local   all             all                                     md5/" /etc/postgresql/*/main/pg_hba.conf
sed -i "s/local   all             postgres                                peer/local   all             postgres                                md5/" /etc/postgresql/*/main/pg_hba.conf

systemctl restart postgresql

print_header "5. Installing PM2 and other tools..."
npm install -g pm2

print_header "6. Installing Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

print_header "7. Creating StreamHib directory..."
cd /root
rm -rf streamhib
mkdir streamhib
cd streamhib

print_status "Installation completed! Now run the setup script..."
print_warning "Next steps:"
print_warning "1. Upload your project files to /root/streamhib/"
print_warning "2. Run: bash setup-streamhib.sh"

echo ""
print_status "PostgreSQL is ready with password: Cawet3Sewu"
print_status "You can now proceed with StreamHib setup!"