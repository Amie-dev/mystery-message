import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { Message } from "@/model/User.model";
import { NextRequest } from "next/server";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { username?: string } }
) {
  await dbConnect();

  const body = await request.json();
  const content = body?.content;
  const username = params.username || body?.username;

  // Validate username
  const parseResult = UsernameQuerySchema.safeParse({ username });
  if (!parseResult.success || !content) {
    return Response.json(
      { success: false, message: "Invalid username or missing content" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Internal server error during sending message" },
      { status: 500 }
    );
  }
}
