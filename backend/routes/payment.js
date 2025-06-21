const express = require('express');
const { PaymentService } = require('../services/PaymentService');
const { ServerProvisioningService } = require('../services/ServerProvisioningService');
const { User, Order } = require('../models');
const { sendEmail } = require('../services/EmailService');
const router = express.Router();

// Package definitions
const PACKAGES = {
  starter: {
    name: 'Set 1 - Starter',
    price: 200000,
    description: 'Paket untuk pemula',
    features: [
      '15 Live 720p, FPS 30, Bit 2500',
      '12 Live 1080p, FPS 30, Bit 6500', 
      '5 Live 4k, FPS 30, Bit 12000',
      'Support YouTube & Facebook',
      'Fitur Penjadwalan YouTube',
      'Bandwidth 20 TB',
      'Penyimpanan 40GB'
    ]
  },
  pro: {
    name: 'Set 2 - Pro',
    price: 250000,
    description: 'Paket untuk creator serius',
    features: [
      '25 Live 720p, FPS 30, Bit 2500',
      '17 Live 1080p, FPS 30, Bit 6500',
      '8 Live 4k, FPS 30, Bit 12000',
      'Support YouTube & Facebook',
      'Fitur Penjadwalan YouTube', 
      'Bandwidth Unlimited',
      'Penyimpanan 60GB'
    ]
  },
  business: {
    name: 'Set 3 - Business',
    price: 350000,
    description: 'Solusi lengkap untuk bisnis',
    features: [
      '40 Live 720p, FPS 30, Bit 2500',
      '25 Live 1080p, FPS 30, Bit 6500',
      '12 Live 4k, FPS 30, Bit 12000',
      'Support YouTube & Facebook',
      'Fitur Penjadwalan YouTube',
      'Bandwidth Unlimited', 
      'Penyimpanan 120GB'
    ]
  }
};

// Get packages
router.get('/packages', (req, res) => {
  res.json({
    success: true,
    packages: PACKAGES
  });
});

// Create payment
router.post('/create', async (req, res) => {
  try {
    const { packageType, userEmail, userName, userPhone } = req.body;

    if (!packageType || !PACKAGES[packageType]) {
      return res.status(400).json({
        success: false,
        message: 'Paket tidak valid'
      });
    }

    if (!userEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Email dan nama wajib diisi'
      });
    }

    const selectedPackage = PACKAGES[packageType];
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order in database
    const order = await Order.create({
      orderId,
      userEmail,
      userName,
      userPhone,
      packageType,
      packageName: selectedPackage.name,
      amount: selectedPackage.price,
      status: 'pending'
    });

    // Create Midtrans payment
    const paymentData = {
      transaction_details: {
        order_id: orderId,
        gross_amount: selectedPackage.price
      },
      customer_details: {
        first_name: userName,
        email: userEmail,
        phone: userPhone || ''
      },
      item_details: [{
        id: packageType,
        price: selectedPackage.price,
        quantity: 1,
        name: selectedPackage.name
      }],
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/payment-successful`
      }
    };

    const snapToken = await PaymentService.createTransaction(paymentData);

    res.json({
      success: true,
      snapToken,
      orderId,
      package: selectedPackage
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat pembayaran'
    });
  }
});

// Midtrans notification webhook
router.post('/notification', async (req, res) => {
  try {
    const notification = req.body;
    console.log('Midtrans notification:', notification);

    const { order_id, transaction_status, fraud_status } = notification;

    // Verify notification
    const isValid = await PaymentService.verifyNotification(notification);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid notification' });
    }

    // Find order
    const order = await Order.findOne({ where: { orderId: order_id } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status based on transaction status
    let newStatus = 'pending';
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        newStatus = 'paid';
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newStatus = 'failed';
    }

    await order.update({ 
      status: newStatus,
      transactionStatus: transaction_status,
      fraudStatus: fraud_status
    });

    // If payment successful, create/update user and provision server
    if (newStatus === 'paid') {
      let user = await User.findOne({ where: { email: order.userEmail } });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          email: order.userEmail,
          fullName: order.userName,
          phone: order.userPhone,
          status: 'active',
          subscription: order.packageType,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
      } else {
        // Update existing user
        await user.update({
          status: 'active',
          subscription: order.packageType,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
      }

      // Send payment success email
      try {
        await sendEmail({
          to: order.userEmail,
          subject: 'Pembayaran Berhasil - StreamHib',
          html: `
            <h2>Pembayaran Berhasil!</h2>
            <p>Halo ${order.userName},</p>
            <p>Pembayaran untuk paket <strong>${order.packageName}</strong> telah berhasil.</p>
            <p>Server Anda sedang dipersiapkan dan akan aktif dalam 5-10 menit.</p>
            <p>Anda akan menerima email dengan detail akses server segera.</p>
            <br>
            <p>Tim StreamHib</p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send payment success email:', emailError);
      }

      // Auto provision server
      try {
        console.log(`Starting auto server provisioning for ${order.userEmail}, package: ${order.packageType}`);
        await ServerProvisioningService.provisionServer(user, order.packageType);
        console.log(`Server provisioning initiated for user ${user.id}`);
      } catch (provisionError) {
        console.error('Auto server provisioning failed:', provisionError);
        // Send email to admin about failed provisioning
        try {
          await sendEmail({
            to: 'admin@streamhib.com',
            subject: 'Server Provisioning Failed',
            html: `
              <h2>Server Provisioning Failed</h2>
              <p>Failed to provision server for user: ${user.email}</p>
              <p>Package: ${order.packageType}</p>
              <p>Error: ${provisionError.message}</p>
              <p>Please provision manually.</p>
            `
          });
        } catch (adminEmailError) {
          console.error('Failed to send admin notification:', adminEmailError);
        }
      }
    }

    res.json({ message: 'OK' });

  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Check payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ where: { orderId } });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    res.json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
        packageName: order.packageName,
        amount: order.amount
      }
    });

  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengecek status pembayaran'
    });
  }
});

module.exports = router;