// actions/sendSupportEmail.ts
// ✨ Server Action for Sending Support Emails via Resend ✨

"use server";

// Mark this as a Server Action
import { Resend } from "resend";
import { z } from "zod"; // For validation

import SupportRequestEmail from "@/components/adLibrary/support/SupportRequestEmail"; // Import the React Email template

// 🔒 Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 🎯 Set this environment variable to the email address (e.g., your Gmail)
// where you want to RECEIVE the support requests.
const supportEmailTo = process.env.SUPPORT_EMAIL_ADDRESS;

// 📧 This 'From' address MUST be a domain verified with Resend.
// It's what the email appears to be sent *from*.
const emailFrom = process.env.SUPPORT_EMAIL_FROM;

// Input validation schema
const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

interface FormState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof ContactFormSchema>["fieldErrors"]; // More specific error type
}

export async function sendSupportEmail(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // --- Environment Variable Check ---
  if (!supportEmailTo || !emailFrom || !process.env.RESEND_API_KEY) {
    console.error("Missing critical environment variables for sending email.");
    return {
      success: false,
      message: "Server configuration error. Cannot send email.",
    };
  }

  // 1. ✅ Validate form data
  const validatedFields = ContactFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    console.log(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      success: false,
      message: "Validation failed. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  // 2. 📧 Attempt to send email using Resend
  try {
    console.log(
      `Attempting to send email via Resend from ${emailFrom} to ${supportEmailTo}`,
    );
    const { data, error } = await resend.emails.send({
      from: emailFrom, // Verified sender domain
      to: [supportEmailTo], // Your support inbox (can be Gmail, Outlook, etc.)
      reply_to: email,
      subject: `Support Request: ${subject}`,
      react: SupportRequestEmail({ name, email, subject, message }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return {
        success: false,
        message: `Failed to send email: ${error.message || "Unknown Resend error"}`, // Provide more specific error if available
      };
    }

    console.log("Email sent successfully via Resend:", data);
    // 3. 🎉 Return success state
    return {
      success: true,
      message:
        "Your message has been sent successfully! We'll be in touch soon.",
    };
  } catch (err) {
    console.error("Unexpected Error Sending Email:", err);
    // Check if it's a known error type if needed
    let errorMessage = "An unexpected error occurred. Please try again.";
    if (err instanceof Error) {
      errorMessage = `An unexpected error occurred: ${err.message}`;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
}
