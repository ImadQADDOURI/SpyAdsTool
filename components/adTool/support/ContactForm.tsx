// components/support/ContactForm.tsx
// ✨ Reusable Contact Form Component ✨

"use client";

import React, { useRef, useState, useTransition } from "react";
import { sendSupportEmail } from "@/actions/sendSupportEmail"; // Import the Server Action

import { CheckCircle, Loader2, Send, XCircle } from "lucide-react"; // Icons for states
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define the shape of the state returned by the server action
interface FormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
}

const initialState: FormState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-white shadow-md transition-all duration-300 hover:from-[#5556d1] hover:to-[#a967e8] hover:shadow-lg focus-visible:ring-[#6566F1]/50"
      size="lg" // Make button larger
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" /> Send Message
        </>
      )}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(sendSupportEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {" "}
      {/* Increased spacing */}
      <div>
        <Label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          required
          className="mt-1.5 border-gray-300 focus:border-[#6566F1] focus:ring-[#6566F1] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400" // Slightly adjusted style
          aria-describedby="name-error"
        />
        {state.errors?.name && (
          <p
            id="name-error"
            className="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            {state.errors.name.join(", ")}
          </p>
        )}
      </div>
      <div>
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="mt-1.5 border-gray-300 focus:border-[#6566F1] focus:ring-[#6566F1] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
          aria-describedby="email-error"
        />
        {state.errors?.email && (
          <p
            id="email-error"
            className="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            {state.errors.email.join(", ")}
          </p>
        )}
      </div>
      <div>
        <Label
          htmlFor="subject"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Subject
        </Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="How can we help?"
          required
          className="mt-1.5 border-gray-300 focus:border-[#6566F1] focus:ring-[#6566F1] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
          aria-describedby="subject-error"
        />
        {state.errors?.subject && (
          <p
            id="subject-error"
            className="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            {state.errors.subject.join(", ")}
          </p>
        )}
      </div>
      <div>
        <Label
          htmlFor="message"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message details..."
          required
          rows={5} // Slightly larger textarea
          className="mt-1.5 border-gray-300 focus:border-[#6566F1] focus:ring-[#6566F1] dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
          aria-describedby="message-error"
        />
        {state.errors?.message && (
          <p
            id="message-error"
            className="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            {state.errors.message.join(", ")}
          </p>
        )}
      </div>
      <SubmitButton />
      {state.message && (
        <div
          className={`mt-4 flex items-center space-x-2 rounded-md p-3 text-sm ${
            state.success
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" // Adjusted colors
              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" // Adjusted colors
          }`}
          role="alert"
        >
          {state.success ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" /> // Added flex-shrink-0
          ) : (
            <XCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      )}
    </form>
  );
}
