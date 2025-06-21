const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending_payment', 'active', 'suspended', 'expired'),
    defaultValue: 'pending_payment'
  },
  subscription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Order Model
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  packageType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  packageName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  },
  transactionStatus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fraudStatus: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Server Model
const Server = sequelize.define('Server', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  hetznerServerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serverName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serverType: {
    type: DataTypes.STRING,
    defaultValue: 'cx11'
  },
  status: {
    type: DataTypes.ENUM('provisioning', 'installing', 'ready', 'error', 'suspended'),
    defaultValue: 'provisioning'
  },
  sshUsername: {
    type: DataTypes.STRING,
    defaultValue: 'root'
  },
  sshPassword: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dashboardUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dashboardUsername: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dashboardPassword: {
    type: DataTypes.STRING,
    allowNull: true
  },
  packageType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// LiveStream Model
const LiveStream = sequelize.define('LiveStream', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  serverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Server,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  streamTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  platform: {
    type: DataTypes.ENUM('youtube', 'facebook', 'both'),
    allowNull: false
  },
  streamKey: {
    type: DataTypes.STRING,
    allowNull: false
  },
  streamUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  videoFile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('stopped', 'starting', 'live', 'error'),
    defaultValue: 'stopped'
  },
  quality: {
    type: DataTypes.STRING,
    defaultValue: '720p'
  },
  bitrate: {
    type: DataTypes.INTEGER,
    defaultValue: 2500
  },
  fps: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  isScheduled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  scheduleStart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  scheduleEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalViewers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  liveDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

// Associations
User.hasMany(Server, { foreignKey: 'userId' });
Server.belongsTo(User, { foreignKey: 'userId' });

Server.hasMany(LiveStream, { foreignKey: 'serverId' });
LiveStream.belongsTo(Server, { foreignKey: 'serverId' });

User.hasMany(LiveStream, { foreignKey: 'userId' });
LiveStream.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Order,
  Server,
  LiveStream
};