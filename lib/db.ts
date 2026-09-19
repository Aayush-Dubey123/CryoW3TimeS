import { MongoClient, MongoClientOptions } from "mongodb";

// Validate MONGODB_URI environment variable
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri: string = process.env.MONGODB_URI;

// MongoDB connection options
const options: MongoClientOptions = {}; // Updated to remove deprecated properties

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Add type declaration for global variable
declare global {
  // Ensures type safety for `_mongoClientPromise`
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Preserve the client across module reloads in development
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Create a new client instance in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the client promise
export default clientPromise;
