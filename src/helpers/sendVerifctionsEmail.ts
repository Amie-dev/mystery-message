import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationsEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "delivered@resend.dev", //after add domain then to set into to:email
      subject: "verifactions email",
      react: VerificationEmail({username:userName,otp:verifyCode}),
    });

    return { success: true, message: "verifactions email send succesfully" };
  } catch (error) {
    console.error("Error sending verifaction email", error);
    return { success: false, message: "Failed to send verifactions email" };
  }
}
