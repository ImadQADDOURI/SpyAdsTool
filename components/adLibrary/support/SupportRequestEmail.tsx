// ✨ React Email Template for Support Requests ✨

import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind, // Use Tailwind for styling within the email
  Text,
} from "@react-email/components";

interface SupportRequestEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SupportRequestEmail: React.FC<SupportRequestEmailProps> = ({
  name,
  email,
  subject,
  message,
}) => {
  const previewText = `New Support Request: ${subject}`;

  return (
    <Html lang="en">
      <Head>
        <title>{previewText}</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brandPurple: "#6566F1",
                brandPink: "#B977F8",
                lightGray: "#f3f4f6", // Example light gray
                darkGray: "#1f2937", // Example dark gray
              },
            },
          },
        }}
      >
        <Body className="bg-lightGray mx-auto my-auto font-sans">
          <Container className="mx-auto my-[40px] max-w-[480px] rounded border border-solid border-gray-200 bg-white p-[20px] shadow-sm">
            <Heading className="text-darkGray mx-0 my-[30px] p-0 text-center text-[24px] font-bold">
              New Support Request
            </Heading>
            <Text className="text-darkGray text-[14px] leading-[24px]">
              You received a message via the support form:
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-gray-200" />

            {/* --- Sender Details --- */}
            <Text className="text-darkGray text-[14px] font-semibold leading-[24px]">
              From:
            </Text>
            <Text className="ml-[10px] text-[14px] leading-[20px] text-gray-700">
              <strong>Name:</strong> {name}
            </Text>
            <Text className="ml-[10px] text-[14px] leading-[20px] text-gray-700">
              <strong>Email:</strong>{" "}
              <Link
                href={`mailto:${email}`}
                className="text-brandPurple underline"
              >
                {email}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-gray-200" />

            {/* --- Message Content --- */}
            <Text className="text-darkGray text-[14px] font-semibold leading-[24px]">
              Subject: {subject}
            </Text>
            <Text className="whitespace-pre-wrap rounded-md border border-solid border-gray-200 bg-gray-50 p-[15px] text-[14px] leading-[24px] text-gray-800">
              {message}
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-gray-200" />
            <Text className="text-center text-[12px] leading-[24px] text-gray-500">
              This email was sent from your application's support system.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SupportRequestEmail;
