import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface OtpVerificationEmailProps {
  otp: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL!;

export const OtpVerificationEmail = ({ otp }: OtpVerificationEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/assets/images/logo.svg`}
            width="212"
            height="88"
            alt="Company Logo"
            style={logo}
          />
          <Text style={tertiary}>Admin Login Verification</Text>
          <Heading style={secondary}>
            Enter the following code to access your admin account.
          </Heading>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={paragraph}>This code will expire in 5 minutes.</Text>
          <Text style={paragraph}>Not expecting this email?</Text>
          <Text style={paragraph}>
            Please ignore this email if you did not request this code.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

// Styles remain the same as in plaid-verify-identity.tsx
// ... (keep all the style constants from the original template)
const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  maxWidth: "360px",
  margin: "0 auto",
  padding: "68px 0 130px",
};

const logo = {
  margin: "0 auto",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
};

const code = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Bold",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "6px",
  lineHeight: "40px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};
