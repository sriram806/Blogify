import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("Missing MongoDB connection string. Set MONGO_URI (or MONGODB_URI) in environment variables.");
    }

    if (process.env.VERCEL && mongoUri.includes("localhost")) {
        throw new Error("Invalid MongoDB URI for Vercel. Use a cloud MongoDB URI (e.g. MongoDB Atlas), not localhost.");
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            bufferCommands: false,
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};

export default connectDB;