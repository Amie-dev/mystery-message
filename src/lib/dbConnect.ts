import mongoose from "mongoose";

type ConnectionObject = {
    isConnect?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnect) {
        console.log("DB is already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "");
        connection.isConnect = db.connections[0].readyState;

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
}

export default dbConnect;
