const express = require('express');
const { User, Order, Server, LiveStream } = require('../models');
const { ServerProvisioningService } = require('../services/ServerProvisioningService');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const stats = await Promise.all([
      User.count({ where: { role: 'user' } }),
      User.count({ where: { status: 'active' } }),
      Order.count({ where: { status: 'paid' } }),
      Server.count(),
      Server.count({ where: { status: 'ready' } }),
      LiveStream.count({ where: { status: 'live' } }),
      Order.sum('amount', { where: { status: 'paid' } }) || 0
    ]);

    const [
      totalUsers,
      activeUsers,
      totalOrders,
      totalServers,
      readyServers,
      liveStreams,
      totalRevenue
    ] = stats;

    // Recent activities
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'userName', 'packageName', 'amount', 'status', 'createdAt']
    });

    const recentUsers = await User.findAll({
      where: { role: 'user' },
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'fullName', 'email', 'status', 'subscription', 'createdAt']
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalOrders,
        totalServers,
        readyServers,
        liveStreams,
        totalRevenue
      },
      recentOrders,
      recentUsers
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { role: 'user' };
    
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Server,
          attributes: ['id', 'serverName', 'status', 'ipAddress']
        }
      ]
    });

    res.json({
      success: true,
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user details
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Server,
          include: [{ model: LiveStream }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const orders = await Order.findAll({
      where: { userEmail: user.email },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      user,
      orders
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user status
router.put('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ status });

    // If suspending user, also suspend their servers
    if (status === 'suspended') {
      const servers = await Server.findAll({ where: { userId: user.id } });
      for (const server of servers) {
        await ServerProvisioningService.suspendServer(server.id);
      }
    }

    res.json({
      success: true,
      message: 'User status updated successfully'
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all servers
router.get('/servers', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: servers } = await Server.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email', 'status']
        }
      ]
    });

    res.json({
      success: true,
      servers,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Manually provision server
router.post('/servers/provision', adminAuth, async (req, res) => {
  try {
    const { userId, packageType } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const server = await ServerProvisioningService.provisionServer(user, packageType);

    res.json({
      success: true,
      message: 'Server provisioning started',
      server
    });

  } catch (error) {
    console.error('Manual server provision error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete server
router.delete('/servers/:id', adminAuth, async (req, res) => {
  try {
    await ServerProvisioningService.deleteServer(req.params.id);

    res.json({
      success: true,
      message: 'Server deleted successfully'
    });

  } catch (error) {
    console.error('Delete server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Revenue analytics
router.get('/analytics/revenue', adminAuth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const revenue = await Order.findAll({
      where: {
        status: 'paid',
        createdAt: {
          [Op.gte]: dateFilter
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      success: true,
      revenue
    });

  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;