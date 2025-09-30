// lib/mongodb.ts
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "campusfreelance";

if (!MONGODB_URI) {
  throw new Error("❌ Please add MONGODB_URI to .env.local");
}

// ------------------------------
// MongoDB Native Client Setup
// ------------------------------
const options = {};
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log("🔄 Creating new MongoDB client connection (dev)");
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
  console.log("🔄 Creating new MongoDB client connection (prod)");
}

// ------------------------------
// Mongoose Connection Setup
// ------------------------------
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("✅ Using existing Mongoose connection");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    isConnected = true;
    console.log("✅ Mongoose connected successfully");
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    throw err;
  }
}

// ------------------------------
// Exports
// ------------------------------
export { connectDB, clientPromise, MONGODB_DB };
export default connectDB;
