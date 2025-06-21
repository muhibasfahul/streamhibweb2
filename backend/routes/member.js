const express = require('express');
const { User, Server, LiveStream } = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// User authentication middleware
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Active account required' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024 // 2GB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv|flv|wmv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// Get user dashboard data
router.get('/dashboard', userAuth, async (req, res) => {
  try {
    const servers = await Server.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: LiveStream,
          attributes: ['id', 'streamTitle', 'platform', 'status', 'totalViewers', 'liveDuration']
        }
      ]
    });

    const totalStreams = await LiveStream.count({
      where: { userId: req.user.id }
    });

    const liveStreams = await LiveStream.count({
      where: { userId: req.user.id, status: 'live' }
    });

    const totalViewers = await LiveStream.sum('totalViewers', {
      where: { userId: req.user.id }
    }) || 0;

    const totalDuration = await LiveStream.sum('liveDuration', {
      where: { userId: req.user.id }
    }) || 0;

    res.json({
      success: true,
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        subscription: req.user.subscription,
        status: req.user.status,
        expiryDate: req.user.expiryDate
      },
      servers,
      stats: {
        totalStreams,
        liveStreams,
        totalViewers,
        totalDuration: Math.floor(totalDuration / 3600) // Convert to hours
      }
    });

  } catch (error) {
    console.error('Member dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user servers
router.get('/servers', userAuth, async (req, res) => {
  try {
    const servers = await Server.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: LiveStream,
          attributes: ['id', 'streamTitle', 'platform', 'status', 'quality', 'totalViewers']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      servers
    });

  } catch (error) {
    console.error('Get user servers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get server details
router.get('/servers/:id', userAuth, async (req, res) => {
  try {
    const server = await Server.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [
        {
          model: LiveStream,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!server) {
      return res.status(404).json({ success: false, message: 'Server not found' });
    }

    res.json({
      success: true,
      server
    });

  } catch (error) {
    console.error('Get server details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new live stream
router.post('/streams', userAuth, async (req, res) => {
  try {
    const { serverId, streamTitle, platform, streamKey, quality = '720p', bitrate = 2500, fps = 30 } = req.body;

    // Verify server belongs to user
    const server = await Server.findOne({
      where: { 
        id: serverId,
        userId: req.user.id,
        status: 'ready'
      }
    });

    if (!server) {
      return res.status(404).json({ success: false, message: 'Server not found or not ready' });
    }

    const stream = await LiveStream.create({
      serverId,
      userId: req.user.id,
      streamTitle,
      platform,
      streamKey,
      quality,
      bitrate,
      fps,
      status: 'stopped'
    });

    res.json({
      success: true,
      message: 'Stream created successfully',
      stream
    });

  } catch (error) {
    console.error('Create stream error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Upload video for stream
router.post('/streams/:id/upload', userAuth, upload.single('video'), async (req, res) => {
  try {
    const stream = await LiveStream.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    await stream.update({
      videoFile: req.file.filename
    });

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start live stream
router.post('/streams/:id/start', userAuth, async (req, res) => {
  try {
    const stream = await LiveStream.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [{ model: Server }]
    });

    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }

    if (!stream.videoFile) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    if (stream.Server.status !== 'ready') {
      return res.status(400).json({ success: false, message: 'Server not ready' });
    }

    // Update stream status
    await stream.update({ 
      status: 'starting',
      streamUrl: this.generateStreamUrl(stream.platform, stream.streamKey)
    });

    // TODO: Send command to server to start streaming
    // This would involve SSH connection to the server and running FFmpeg command
    
    // Simulate stream starting
    setTimeout(async () => {
      await stream.update({ status: 'live' });
    }, 5000);

    res.json({
      success: true,
      message: 'Stream starting...',
      stream
    });

  } catch (error) {
    console.error('Start stream error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Stop live stream
router.post('/streams/:id/stop', userAuth, async (req, res) => {
  try {
    const stream = await LiveStream.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }

    // TODO: Send command to server to stop streaming
    
    await stream.update({ status: 'stopped' });

    res.json({
      success: true,
      message: 'Stream stopped successfully'
    });

  } catch (error) {
    console.error('Stop stream error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Schedule stream
router.post('/streams/:id/schedule', userAuth, async (req, res) => {
  try {
    const { scheduleStart, scheduleEnd } = req.body;
    
    const stream = await LiveStream.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }

    await stream.update({
      isScheduled: true,
      scheduleStart: new Date(scheduleStart),
      scheduleEnd: new Date(scheduleEnd)
    });

    res.json({
      success: true,
      message: 'Stream scheduled successfully'
    });

  } catch (error) {
    console.error('Schedule stream error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user streams
router.get('/streams', userAuth, async (req, res) => {
  try {
    const streams = await LiveStream.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Server,
          attributes: ['id', 'serverName', 'status', 'ipAddress']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      streams
    });

  } catch (error) {
    console.error('Get user streams error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to generate stream URL
function generateStreamUrl(platform, streamKey) {
  const urls = {
    youtube: `rtmp://a.rtmp.youtube.com/live2/${streamKey}`,
    facebook: `rtmps://live-api-s.facebook.com:443/rtmp/${streamKey}`
  };
  return urls[platform] || urls.youtube;
}

module.exports = router;