import { MongoClient } from 'mongodb';

// MongoDB connection URI (using environment variable if available, or default to local MongoDB)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// MongoDB database name
const dbName = 'cisfMedicalSystem';

// MongoDB client
let client;
let db;

/**
 * Connect to MongoDB
 */
async function connectToDb() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    
    // Create collections if they don't exist
    await db.createCollection('users');
    await db.createCollection('officers');
    await db.createCollection('claims');
    await db.createCollection('entitlements');
    await db.createCollection('profiles');
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Fallback to in-memory if MongoDB connection fails
    console.log('Falling back to in-memory storage');
    return null;
  }
}

/**
 * Get MongoDB database instance
 */
function getDb() {
  return db;
}

/**
 * Close MongoDB connection
 */
async function closeDb() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

export {
  connectToDb,
  getDb,
  closeDb
};