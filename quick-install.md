# 🚀 StreamHib Quick Install Guide

## 📋 Prerequisites
- Ubuntu/Debian Server
- Root access
- Domain pointing to server (ess.my.id)

## 🛠️ Installation Steps

### 1. Download & Run System Setup
```bash
# Download install script
wget https://raw.githubusercontent.com/your-repo/streamhib/main/install-streamhib.sh

# Make executable and run
chmod +x install-streamhib.sh
sudo ./install-streamhib.sh
```

### 2. Upload Project Files
```bash
# Upload your StreamHib project to /root/streamhib/
# You can use SCP, SFTP, or Git clone
cd /root/streamhib
```

### 3. Run Project Setup
```bash
# Make setup script executable
chmod +x setup-streamhib.sh

# Run setup
./setup-streamhib.sh
```

## 🎯 Access Your StreamHib

After installation:

- **Website**: http://ess.my.id
- **Admin Dashboard**: http://ess.my.id/admin
  - Login: `admin@streamhib.com` / `admin123`
- **Member Area**: http://ess.my.id/member
  - Test Login: `test@streamhib.com` / `test123`

## 🔧 Management Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Check Nginx
sudo systemctl status nginx

# Check database
sudo -u postgres psql streamhib
```

## 🚨 Troubleshooting

### Database Issues
```bash
# Reset database
cd /root/streamhib/backend
node setup-database-final.js
```

### Service Issues
```bash
# Restart all services
pm2 restart all
sudo systemctl restart nginx
```

### Check Logs
```bash
# Backend logs
pm2 logs streamhib-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 🎉 Features Ready

✅ **Admin Dashboard** - Manage users, orders, servers
✅ **Member Area** - User dashboard and controls  
✅ **Payment Integration** - Midtrans payment gateway
✅ **Auto Server Provisioning** - Hetzner integration
✅ **Email Notifications** - Welcome and server ready emails
✅ **Multi-language** - Indonesian & English
✅ **Responsive Design** - Works on all devices

Your StreamHib automation platform is now live! 🚀