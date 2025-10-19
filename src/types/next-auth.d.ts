import "next-auth";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    email: string;
    //   password: string;
    //   verifyCode: string;
    //   verifyCodeExpiry: Date;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    //   messages: Message[];
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      email: string;
      //   password: string;
      //   verifyCode: string;
      //   verifyCodeExpiry: Date;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      //   messages: Message[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    email: string;

    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
