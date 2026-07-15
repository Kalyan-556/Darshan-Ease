const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'uploads', 'mockDb');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DB_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading mock db collection ${collection}:`, err);
    return [];
  }
};

const writeData = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing mock db collection ${collection}:`, err);
    return false;
  }
};

const mockDb = {
  find: (collection, query = {}) => {
    let items = readData(collection);
    return items.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          // Soft check for ID or string fields
          if (key === '_id' || key === 'userId' || key === 'templeId' || key === 'slotId') {
            if (String(item[key]) !== String(query[key])) return false;
          } else {
            return false;
          }
        }
      }
      return true;
    });
  },

  findOne: (collection, query = {}) => {
    const items = mockDb.find(collection, query);
    return items[0] || null;
  },

  findById: (collection, id) => {
    return mockDb.findOne(collection, { _id: id });
  },

  create: (collection, doc) => {
    const items = readData(collection);
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    writeData(collection, items);
    return newDoc;
  },

  findByIdAndUpdate: (collection, id, updateData) => {
    const items = readData(collection);
    const idx = items.findIndex(item => String(item._id) === String(id));
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updateData, updatedAt: new Date().toISOString() };
    writeData(collection, items);
    return items[idx];
  },

  findByIdAndDelete: (collection, id) => {
    let items = readData(collection);
    const item = items.find(i => String(i._id) === String(id));
    if (!item) return null;
    items = items.filter(i => String(i._id) !== String(id));
    writeData(collection, items);
    return item;
  },

  countDocuments: (collection, query = {}) => {
    return mockDb.find(collection, query).length;
  },

  // Clear or reset a collection
  clearCollection: (collection) => {
    writeData(collection, []);
  }
};

module.exports = mockDb;
