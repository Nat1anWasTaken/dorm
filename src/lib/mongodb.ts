import { MongoClient, MongoClientOptions } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL environment variable is not defined');
}

const uri = process.env.MONGODB_URL;

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

class MongoConnection {
  private static instance: MongoConnection;
  private client: MongoClient | null = null;
  private mongooseConnection: typeof mongoose | null = null;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async getClient(): Promise<MongoClient> {
    if (!this.client) {
      this.client = new MongoClient(uri, options);
      await this.client.connect();
    }
    return this.client;
  }

  public async getMongoose(): Promise<typeof mongoose> {
    if (!this.mongooseConnection) {
      this.mongooseConnection = await mongoose.connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
    return this.mongooseConnection;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    if (this.mongooseConnection) {
      await mongoose.disconnect();
      this.mongooseConnection = null;
    }
  }
}

export const mongoConnection = MongoConnection.getInstance();

export async function connectToDatabase() {
  try {
    const client = await mongoConnection.getClient();
    console.log('Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function connectMongoose() {
  try {
    const mongoose = await mongoConnection.getMongoose();
    console.log('Connected to MongoDB via Mongoose successfully');
    return mongoose;
  } catch (error) {
    console.error('Failed to connect to MongoDB via Mongoose:', error);
    throw error;
  }
}

process.on('SIGINT', async () => {
  await mongoConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoConnection.disconnect();
  process.exit(0);
});