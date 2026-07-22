const mongoose = require('mongoose');
const MockModel = require('./mockMongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coaching-institute';
    console.log(`Attempting to connect to MongoDB: ${mongoUri}`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = 'false';
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.warn('⚠️ WARNING: Local MongoDB instance not detected. Falling back to file-based local JSON database for development/testing.');
    process.env.USE_MOCK_DB = 'true';
  }
};

// Global cache of mock models to avoid recreating them
const mockModelsCache = {};

const getMockModel = (name) => {
  if (!mockModelsCache[name]) {
    const mockModel = new MockModel(name);
    // Create a constructor function
    const ConstructorWrapper = function(data) {
      return MockModel.createInstance(name, data);
    };
    Object.setPrototypeOf(ConstructorWrapper, mockModel);
    Object.assign(ConstructorWrapper, mockModel);
    mockModelsCache[name] = ConstructorWrapper;
  }
  return mockModelsCache[name];
};

const getMongooseModel = (name, schema) => {
  return mongoose.models[name] || mongoose.model(name, schema);
};

const getModel = (name, schema) => {
  // Return a proxy that resolves dynamically at call-time
  return new Proxy(function() {}, {
    // Intercept standard method calls (e.g. Model.find)
    get(target, prop) {
      const activeModel = (process.env.USE_MOCK_DB === 'true')
        ? getMockModel(name)
        : getMongooseModel(name, schema);
      
      const value = activeModel[prop];
      if (typeof value === 'function') {
        return value.bind(activeModel);
      }
      return value;
    },
    // Intercept instantiation (e.g. new Model(data))
    construct(target, argumentsList) {
      const activeModel = (process.env.USE_MOCK_DB === 'true')
        ? getMockModel(name)
        : getMongooseModel(name, schema);
      
      return Reflect.construct(activeModel, argumentsList);
    }
  });
};

module.exports = {
  connectDB,
  getModel,
};
