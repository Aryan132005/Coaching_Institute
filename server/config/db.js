const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

let sequelize;
const db = {};

const connectDB = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const pass = process.env.DB_PASSWORD || '';
  const name = process.env.DB_NAME || 'coaching_institute';
  const port = process.env.DB_PORT || 3306;

  try {
    // Attempt MySQL connection
    console.log(`Attempting to connect to MySQL database: ${name} on ${host}:${port}...`);
    
    const tempSequelize = new Sequelize({
      dialect: 'mysql',
      host: host,
      port: port,
      username: user,
      password: pass,
      logging: false,
    });
    
    await tempSequelize.authenticate();
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${name}\`;`);
    await tempSequelize.close();

    sequelize = new Sequelize(name, user, pass, {
      host: host,
      port: port,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
      },
    });

    await sequelize.authenticate();
    console.log('Successfully connected to MySQL database.');
  } catch (error) {
    console.error(`MySQL connection failed: ${error.message}`);
    console.log('⚠️ WARNING: Local MySQL instance not detected. Falling back to SQLite.');
    
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(dataDir, 'database.sqlite'),
      logging: false,
      define: {
        timestamps: true,
      },
    });

    await sequelize.authenticate();
    console.log('Successfully connected to SQLite database.');
  }

  // Load models dynamically to bind to the connected sequelize instance
  db.User = require('../models/user')(sequelize);
  db.Course = require('../models/course')(sequelize);
  db.Faculty = require('../models/faculty')(sequelize);
  db.Announcement = require('../models/announcement')(sequelize);
  db.Enquiry = require('../models/enquiry')(sequelize);
  db.Admission = require('../models/admission')(sequelize);

  // Define Associations
  // 1. Announcement -> User
  db.Announcement.belongsTo(db.User, { as: 'author', foreignKey: 'postedBy' });
  db.User.hasMany(db.Announcement, { foreignKey: 'postedBy' });

  // 2. Admission -> Course
  db.Admission.belongsTo(db.Course, { as: 'course', foreignKey: 'courseId' });
  db.Course.hasMany(db.Admission, { foreignKey: 'courseId' });

  // Sync database schema
  await sequelize.sync();
  console.log('Database models synchronized successfully.');
};

// Helper for dynamic loading / fallback access
const getModel = (modelName) => {
  if (!sequelize) {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(dataDir, 'database.sqlite'),
      logging: false,
      define: {
        timestamps: true,
      },
    });
  }

  if (!db[modelName]) {
    db[modelName] = require(`../models/${modelName.toLowerCase()}`)(sequelize);
  }
  return db[modelName];
};

module.exports = {
  connectDB,
  User: getModel('User'),
  Course: getModel('Course'),
  Faculty: getModel('Faculty'),
  Announcement: getModel('Announcement'),
  Enquiry: getModel('Enquiry'),
  Admission: getModel('Admission'),
  getSequelize: () => sequelize,
};
