import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userId = session.user._id;

  try {
    const foundUser = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!foundUser || foundUser.length === 0) {
      return Response.json(
        { success: false, message: "User not found or has no messages" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: foundUser[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
