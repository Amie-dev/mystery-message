import mongoose, { Schema, Document } from "mongoose";
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "UserName is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ ensures no duplicate emails
      trim: true,
      match: [/.+\@.+\..+/, "Provide valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    verifyCode: {
      type: String,
      required: [true, "verify code is required"],
      trim: true,
    },
    verifyCodeExpiry: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      required: true,
      default: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);


  export default User