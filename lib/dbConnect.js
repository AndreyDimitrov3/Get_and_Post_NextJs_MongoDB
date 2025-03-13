import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(
      (mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      },
      (error) => {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
      }
    );
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
