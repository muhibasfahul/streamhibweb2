const { HetznerService } = require('./HetznerService');
const { sendEmail } = require('./EmailService');
const { Server, User } = require('../models');
const crypto = require('crypto');

class ServerProvisioningService {
  constructor() {
    this.hetzner = HetznerService;
  }

  generatePassword(length = 16) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  generateUserData(dashboardPassword, sshPassword) {
    return `#!/bin/bash
# StreamHib Server Setup Script

# Update system
apt-get update && apt-get upgrade -y

# Install required packages
apt-get install -y curl wget git nginx nodejs npm ffmpeg python3 python3-pip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create streamhib user
useradd -m -s /bin/bash streamhib
echo "streamhib:${dashboardPassword}" | chpasswd
usermod -aG sudo,docker streamhib

# Set root password
echo "root:${sshPassword}" | chpasswd

# Enable SSH password authentication
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
systemctl restart sshd

# Create StreamHib dashboard directory
mkdir -p /home/streamhib/dashboard
chown -R streamhib:streamhib /home/streamhib/dashboard

# Install StreamHib Dashboard (placeholder)
cat > /home/streamhib/dashboard/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>StreamHib Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { padding: 15px; background: #e8f5e8; border-left: 4px solid #4caf50; margin: 20px 0; }
        .info { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
        .button { background: #4caf50; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
        .button:hover { background: #45a049; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .card { background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 StreamHib Dashboard</h1>
        <div class="status">
            <strong>✅ Server Status: READY</strong><br>
            Your streaming server is ready to use!
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📊 Server Info</h3>
                <p><strong>IP Address:</strong> <span id="server-ip">Loading...</span></p>
                <p><strong>Server Type:</strong> Hetzner CX11</p>
                <p><strong>OS:</strong> Ubuntu 20.04</p>
                <p><strong>Status:</strong> <span style="color: green;">Online</span></p>
            </div>
            
            <div class="card">
                <h3>🎥 Streaming Stats</h3>
                <p><strong>Active Streams:</strong> 0</p>
                <p><strong>Total Uptime:</strong> 0h 0m</p>
                <p><strong>Bandwidth Used:</strong> 0 GB</p>
                <p><strong>Storage Used:</strong> 0 GB</p>
            </div>
        </div>
        
        <div class="info">
            <h3>📋 Quick Start Guide</h3>
            <ol>
                <li>Upload your video files to the server</li>
                <li>Configure your YouTube/Facebook stream keys</li>
                <li>Set your streaming schedule</li>
                <li>Start your 24/7 live stream!</li>
            </ol>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button class="button" onclick="alert('Feature coming soon!')">📤 Upload Video</button>
            <button class="button" onclick="alert('Feature coming soon!')">⚙️ Stream Settings</button>
            <button class="button" onclick="alert('Feature coming soon!')">📅 Schedule Stream</button>
            <button class="button" onclick="alert('Feature coming soon!')">▶️ Start Stream</button>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
            <h4>🔧 Need Help?</h4>
            <p>Contact StreamHib support:</p>
            <p>📧 Email: support@streamhib.com</p>
            <p>💬 WhatsApp: +62 857-2216-5165</p>
        </div>
    </div>
    
    <script>
        // Get server IP
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('server-ip').textContent = data.ip;
            })
            .catch(() => {
                document.getElementById('server-ip').textContent = 'Unable to detect';
            });
    </script>
</body>
</html>
EOF

# Setup Nginx for dashboard
cat > /etc/nginx/sites-available/streamhib-dashboard << 'EOF'
server {
    listen 8080;
    server_name _;
    
    root /home/streamhib/dashboard;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Basic auth for security
    auth_basic "StreamHib Dashboard";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
EOF

# Create htpasswd file
echo "streamhib:$(openssl passwd -apr1 ${dashboardPassword})" > /etc/nginx/.htpasswd

# Enable site
ln -s /etc/nginx/sites-available/streamhib-dashboard /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Create status file
echo "READY" > /home/streamhib/server-status.txt
echo "$(date)" >> /home/streamhib/server-status.txt

# Setup firewall
ufw allow ssh
ufw allow 8080
ufw --force enable

echo "StreamHib server setup completed!" > /var/log/streamhib-setup.log
`;
  }

  async provisionServer(user, packageType) {
    try {
      // Generate credentials
      const sshPassword = this.generatePassword(16);
      const dashboardPassword = this.generatePassword(12);
      const serverName = `streamhib-${user.id.slice(0, 8)}`;

      // Create server record in database
      const server = await Server.create({
        userId: user.id,
        serverName,
        packageType,
        status: 'provisioning',
        sshPassword,
        dashboardUsername: 'streamhib',
        dashboardPassword,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      // Create server on Hetzner
      const userData = this.generateUserData(dashboardPassword, sshPassword);
      
      const hetznerResponse = await this.hetzner.createServer({
        name: serverName,
        serverType: this.getServerType(packageType),
        image: 'ubuntu-20.04',
        userData
      });

      // Update server with Hetzner details
      await server.update({
        hetznerServerId: hetznerResponse.server.id,
        ipAddress: hetznerResponse.server.public_net.ipv4.ip,
        status: 'installing'
      });

      // Wait for server to be ready (polling)
      setTimeout(() => {
        this.checkServerStatus(server.id);
      }, 60000); // Check after 1 minute

      return server;

    } catch (error) {
      console.error('Server provisioning error:', error);
      throw error;
    }
  }

  async checkServerStatus(serverId) {
    try {
      const server = await Server.findByPk(serverId);
      if (!server) return;

      // Check if server is ready by trying to access the dashboard
      const dashboardUrl = `http://${server.ipAddress}:8080`;
      
      try {
        const response = await fetch(dashboardUrl, { timeout: 5000 });
        if (response.ok) {
          // Server is ready
          await server.update({
            status: 'ready',
            dashboardUrl
          });

          // Send email with server details
          await this.sendServerReadyEmail(server);
        } else {
          // Still installing, check again in 2 minutes
          setTimeout(() => {
            this.checkServerStatus(serverId);
          }, 120000);
        }
      } catch (error) {
        // Server not ready yet, check again in 2 minutes
        setTimeout(() => {
          this.checkServerStatus(serverId);
        }, 120000);
      }

    } catch (error) {
      console.error('Server status check error:', error);
    }
  }

  async sendServerReadyEmail(server) {
    try {
      const user = await User.findByPk(server.userId);
      if (!user) return;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1>🚀 Server StreamHib Anda Sudah Siap!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Halo ${user.fullName}!</h2>
            <p>Kabar gembira! Server streaming 24/7 Anda sudah siap digunakan.</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3>📋 Detail Server Anda:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Server Name:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${server.serverName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>IP Address:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${server.ipAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Dashboard URL:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${server.dashboardUrl}" style="color: #4caf50;">${server.dashboardUrl}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Username:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${server.dashboardUsername}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Password:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px;">${server.dashboardPassword}</code></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Paket:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${server.packageType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px;"><strong>Expired:</strong></td>
                  <td style="padding: 8px;">${new Date(server.expiryDate).toLocaleDateString('id-ID')}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>🎯 Langkah Selanjutnya:</h3>
              <ol>
                <li><strong>Login ke Dashboard:</strong> Klik link dashboard di atas dan login dengan username/password yang diberikan</li>
                <li><strong>Upload Video:</strong> Upload video yang ingin di-loop untuk streaming</li>
                <li><strong>Setup Stream Key:</strong> Masukkan stream key YouTube/Facebook Anda</li>
                <li><strong>Mulai Streaming:</strong> Klik tombol start dan nikmati live streaming 24/7!</li>
              </ol>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>⚠️ Penting untuk Disimpan:</h3>
              <p>Simpan email ini dengan baik! Informasi login dan IP address server sangat penting untuk akses ke dashboard streaming Anda.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${server.dashboardUrl}" style="background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">🚀 Akses Dashboard Sekarang</a>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>🔧 Butuh Bantuan?</h3>
              <p>Tim support kami siap membantu Anda 24/7:</p>
              <p>📧 Email: support@streamhib.com</p>
              <p>💬 WhatsApp: <a href="https://wa.me/6285722165165">+62 857-2216-5165</a></p>
              <p>📱 Telegram: <a href="https://t.me/streamhib">@streamhib</a></p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p>Terima kasih telah mempercayai StreamHib!</p>
            <p style="font-size: 12px; opacity: 0.8;">© 2025 StreamHib. All rights reserved.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: '🚀 Server StreamHib Anda Sudah Siap! - Detail Akses Dashboard',
        html: emailHtml
      });

      console.log(`Server ready email sent to ${user.email}`);

    } catch (error) {
      console.error('Failed to send server ready email:', error);
    }
  }

  getServerType(packageType) {
    const serverTypes = {
      'starter': 'cx11',    // 1 vCPU, 2GB RAM
      'pro': 'cx21',        // 2 vCPU, 4GB RAM  
      'business': 'cx31'    // 2 vCPU, 8GB RAM
    };
    return serverTypes[packageType] || 'cx11';
  }

  async suspendServer(serverId) {
    try {
      const server = await Server.findByPk(serverId);
      if (!server) throw new Error('Server not found');

      // Suspend on Hetzner (power off)
      await this.hetzner.powerOffServer(server.hetznerServerId);
      
      // Update status
      await server.update({ status: 'suspended' });

      return { success: true };
    } catch (error) {
      console.error('Server suspension error:', error);
      throw error;
    }
  }

  async deleteServer(serverId) {
    try {
      const server = await Server.findByPk(serverId);
      if (!server) throw new Error('Server not found');

      // Delete from Hetzner
      if (server.hetznerServerId) {
        await this.hetzner.deleteServer(server.hetznerServerId);
      }
      
      // Delete from database
      await server.destroy();

      return { success: true };
    } catch (error) {
      console.error('Server deletion error:', error);
      throw error;
    }
  }
}

module.exports = {
  ServerProvisioningService: new ServerProvisioningService()
};