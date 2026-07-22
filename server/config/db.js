const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

let sequelize;
const db = {};

// Helper to define associations on currently active models in db
const defineAssociations = () => {
  if (db.Announcement && db.User) {
    db.Announcement.belongsTo(db.User, { as: 'author', foreignKey: 'postedBy' });
    db.User.hasMany(db.Announcement, { foreignKey: 'postedBy' });
  }

  if (db.Admission && db.Course) {
    db.Admission.belongsTo(db.Course, { as: 'course', foreignKey: 'courseId' });
    db.Course.hasMany(db.Admission, { foreignKey: 'courseId' });
  }
};

// Helper to dynamically load a model if it hasn't been instantiated yet
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
    defineAssociations();
  }
  return db[modelName];
};

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

  // Load/rebind models on the active connection instance
  db.User = require('../models/user')(sequelize);
  db.Course = require('../models/course')(sequelize);
  db.Faculty = require('../models/faculty')(sequelize);
  db.Announcement = require('../models/announcement')(sequelize);
  db.Enquiry = require('../models/enquiry')(sequelize);
  db.Admission = require('../models/admission')(sequelize);

  // Define Associations
  defineAssociations();

  // Sync database schema
  await sequelize.sync();
  console.log('Database models synchronized successfully.');
};

// Create a Proxy around Sequelize models to defer evaluation to request-time
const makeModelProxy = (modelName) => {
  return new Proxy({}, {
    get(target, prop) {
      const activeModel = db[modelName] || getModel(modelName);
      const value = activeModel[prop];
      if (typeof value === 'function') {
        return value.bind(activeModel);
      }
      return value;
    },
    set(target, prop, value) {
      const activeModel = db[modelName] || getModel(modelName);
      activeModel[prop] = value;
      return true;
    },
    construct(target, args) {
      const activeModel = db[modelName] || getModel(modelName);
      return Reflect.construct(activeModel, args);
    },
    getPrototypeOf(target) {
      const activeModel = db[modelName] || getModel(modelName);
      return Reflect.getPrototypeOf(activeModel);
    }
  });
};

module.exports = {
  connectDB,
  User: makeModelProxy('User'),
  Course: makeModelProxy('Course'),
  Faculty: makeModelProxy('Faculty'),
  Announcement: makeModelProxy('Announcement'),
  Enquiry: makeModelProxy('Enquiry'),
  Admission: makeModelProxy('Admission'),
  getSequelize: () => sequelize,
};
