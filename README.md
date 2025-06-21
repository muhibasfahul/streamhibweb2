# 🚀 StreamHib - Setup & Deployment Guide

## 📋 Prerequisites
- Ubuntu/Debian Server (VPS)
- Node.js 18+ 
- PostgreSQL
- Domain (opsional)

## 🛠️ Setup di Server Ubuntu/Debian

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Setup Database
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE streamhib;
CREATE USER streamhib_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE streamhib TO streamhib_user;
\q
```

### 5. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 6. Clone/Upload Project
```bash
# Jika dari Git
git clone your-repo-url streamhib
cd streamhib

# Atau upload manual via SCP/SFTP
```

### 7. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 8. Setup Environment Variables
```bash
cd backend
cp .env.example .env
nano .env
```

Edit file `.env`:
```env
# Database
DATABASE_URL=postgresql://streamhib_user:your_strong_password@localhost:5432/streamhib

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=streamhib@gmail.com
EMAIL_PASS=gzse ljrc yfrq ogwa

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-Y9ym1xDXthYjcEDtpJuN8I0X
MIDTRANS_CLIENT_KEY=SB-Mid-client-YnXAE6VufDGa3w61
MIDTRANS_MERCHANT_ID=G372974330
MIDTRANS_IS_PRODUCTION=false

# Hetzner
HETZNER_API_TOKEN=NAcu7LsOjbUctpEBOsDztAJnvWYl9LIJlai5LbTaHVKfKlKkrFcXmMq4XHBzbxu8

# App
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://your-domain.com
```

### 9. Setup Database Tables
```bash
cd backend
node -e "
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending_payment', 'active', 'suspended'), defaultValue: 'pending_payment' },
  subscription: { type: DataTypes.STRING }
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.STRING, unique: true, allowNull: false },
  userEmail: { type: DataTypes.STRING, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  userPhone: { type: DataTypes.STRING },
  packageType: { type: DataTypes.STRING, allowNull: false },
  packageName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
  transactionStatus: { type: DataTypes.STRING },
  fraudStatus: { type: DataTypes.STRING }
});

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced!');
  process.exit(0);
});
"
```

### 10. Build Frontend
```bash
npm run build
```

### 11. Start Services with PM2
```bash
# Start Backend
cd backend
pm2 start app.js --name "streamhib-backend"

# Start Frontend (jika perlu serve static)
cd ..
pm2 serve out 3000 --name "streamhib-frontend"

# Save PM2 config
pm2 save
pm2 startup
```

### 12. Setup Nginx (Reverse Proxy)
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/streamhib
```

Config Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/streamhib /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 13. Setup SSL (Optional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 🧪 Testing

### Local Testing (Development)
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

Buka: `http://localhost:3000`

### Production Testing
Buka: `http://your-domain.com`

## 🔍 Troubleshooting

### Check Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
pm2 restart all
sudo systemctl restart nginx
```

### Database Issues
```bash
sudo -u postgres psql streamhib
\dt  # List tables
```

## 📱 Test Flow

1. **Register**: `/register`
2. **Login**: `/login` 
3. **Select Package**: `/#pricing`
4. **Payment**: Midtrans popup
5. **Dashboard**: `/dashboard`

## 🎯 Next Steps

1. Setup domain DNS
2. Configure SSL certificate
3. Test payment webhook
4. Setup monitoring
5. Backup strategy

---

**Need help?** Contact support atau check logs untuk debugging.