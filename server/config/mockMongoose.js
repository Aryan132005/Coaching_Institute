const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate simple Unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// Helper to deep clone
const clone = (val) => JSON.parse(JSON.stringify(val));

// Helper to wrap a document so it behaves like a Mongoose document
const wrapMockDocument = (item, modelName) => {
  if (!item) return null;
  
  Object.defineProperty(item, 'save', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: async function() {
      const fs = require('fs');
      const path = require('path');
      const DATA_DIR = path.join(__dirname, '../data');
      const filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
      
      let items = [];
      if (fs.existsSync(filePath)) {
        items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      
      const index = items.findIndex(x => x._id === this._id.toString());
      
      // Clean clone without functions
      const itemToWrite = {};
      for (const k of Object.keys(this)) {
        if (typeof this[k] !== 'function') {
          itemToWrite[k] = this[k];
        }
      }
      
      if (index >= 0) {
        items[index] = itemToWrite;
      } else {
        items.push(itemToWrite);
      }
      
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
      return this;
    }
  });
  
  return item;
};

class Query {
  constructor(data, modelName, isSingle = false) {
    this._data = clone(data);
    this._modelName = modelName;
    this._isSingle = isSingle;
    this._populateOptions = [];
    this._sortOption = null;
  }

  sort(sortOption) {
    this._sortOption = sortOption;
    return this;
  }

  populate(pathName, selectFields) {
    this._populateOptions.push({ pathName, selectFields });
    return this;
  }

  select(selectFields) {
    // No-op for mock, just keeps code from breaking
    return this;
  }

  async exec() {
    let result = this._data;

    // Handle Sorting
    if (this._sortOption && Array.isArray(result)) {
      let field = '';
      let direction = 1;
      if (typeof this._sortOption === 'string') {
        if (this._sortOption.startsWith('-')) {
          field = this._sortOption.substring(1);
          direction = -1;
        } else {
          field = this._sortOption;
          direction = 1;
        }
      } else if (typeof this._sortOption === 'object') {
        field = Object.keys(this._sortOption)[0];
        direction = this._sortOption[field];
      }

      if (field) {
        result.sort((a, b) => {
          const valA = a[field];
          const valB = b[field];
          if (valA < valB) return -1 * direction;
          if (valA > valB) return 1 * direction;
          return 0;
        });
      }
    }

    // Handle Populate
    if (this._populateOptions.length > 0 && Array.isArray(result)) {
      for (const pop of this._populateOptions) {
        const { pathName } = pop;
        // Find reference model
        let refModelName = '';
        if (pathName === 'courseId') refModelName = 'Course';
        if (pathName === 'postedBy') refModelName = 'User';

        if (refModelName) {
          const refFilePath = path.join(DATA_DIR, `${refModelName.toLowerCase()}s.json`);
          let refData = [];
          if (fs.existsSync(refFilePath)) {
            refData = JSON.parse(fs.readFileSync(refFilePath, 'utf8'));
          }

          result = result.map(item => {
            if (item[pathName]) {
              const matchedRef = refData.find(r => r._id === item[pathName].toString());
              if (matchedRef) {
                item[pathName] = clone(matchedRef);
              }
            }
            return item;
          });
        }
      }
    }

    if (this._isSingle) {
      const item = result.length > 0 ? result[0] : null;
      return this._modelName ? wrapMockDocument(item, this._modelName) : item;
    }
    return this._modelName ? result.map(item => wrapMockDocument(item, this._modelName)) : result;
  }

  // Thenable interface so it can be directly awaited
  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }
}

class MockModel {
  constructor(modelName) {
    this.modelName = modelName;
    this.filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  _read() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // Matches query conditions
  _matches(item, query) {
    if (!query || Object.keys(query).length === 0) return true;

    for (const key in query) {
      const val = query[key];

      // Handle $or query
      if (key === '$or' && Array.isArray(val)) {
        let matchOr = false;
        for (const subQuery of val) {
          if (this._matches(item, subQuery)) {
            matchOr = true;
            break;
          }
        }
        if (!matchOr) return false;
        continue;
      }

      // Handle regex search: { key: { $regex: value, $options: 'i' } }
      if (val && typeof val === 'object' && val.$regex) {
        const regexVal = val.$regex;
        const options = val.$options || '';
        const regex = new RegExp(regexVal, options);
        if (!regex.test(item[key] || '')) {
          return false;
        }
        continue;
      }

      // Exact match
      if (item[key] !== val) {
        return false;
      }
    }
    return true;
  }

  find(query = {}) {
    const items = this._read();
    const filtered = items.filter(item => this._matches(item, query));
    return new Query(filtered, this.modelName);
  }

  findOne(query = {}) {
    const items = this._read();
    const filtered = items.filter(item => this._matches(item, query));
    return new Query(filtered, this.modelName, true);
  }

  findById(id) {
    return this.findOne({ _id: id ? id.toString() : null });
  }

  async create(data) {
    const items = this._read();
    const newItem = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      appliedAt: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    items.push(newItem);
    this._write(items);
    return wrapMockDocument(newItem, this.modelName);
  }

  async deleteOne(query) {
    const items = this._read();
    const initialLength = items.length;
    const filtered = items.filter(item => !this._matches(item, query));
    this._write(filtered);
    return { deletedCount: initialLength - filtered.length };
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      this._write([]);
      return { deletedCount: 0 };
    }
    const items = this._read();
    const filtered = items.filter(item => !this._matches(item, query));
    this._write(filtered);
    return { deletedCount: items.length - filtered.length };
  }

  async insertMany(arr) {
    const items = this._read();
    const createdItems = arr.map(data => ({
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      appliedAt: new Date().toISOString(),
      date: new Date().toISOString(),
    }));
    items.push(...createdItems);
    this._write(items);
    return createdItems;
  }

  // For instantiating model e.g. new Course(...)
  static createInstance(modelName, data) {
    const model = new MockModel(modelName);
    const instance = {
      _id: generateId(),
      ...data,
      save: async function() {
        const items = model._read();
        const index = items.findIndex(item => item._id === this._id);
        if (index >= 0) {
          items[index] = { ...this };
        } else {
          items.push(this);
        }
        model._write(items);
        return this;
      }
    };
    return instance;
  }
}

module.exports = MockModel;
