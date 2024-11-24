import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from "@react-email/components";

interface PurchaseConfirmationEmailProps {
  customerName: string;
  beatTitle: string;
  downloadPageUrl: string;
  expiryDate: string;
}

export default function PurchaseConfirmationEmail({
  customerName,
  beatTitle,
  downloadPageUrl,
  expiryDate,
}: PurchaseConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your beat purchase confirmation and download instructions
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hi {customerName},</Text>
          <Text style={paragraph}>
            Thank you for purchasing {beatTitle}! Your files are ready for
            download.
          </Text>
          <Text style={paragraph}>
            Click the button below to access your download page. Please note
            that the download links will expire on {expiryDate}.
          </Text>
          <Link href={downloadPageUrl} style={button}>
            Download Your Files
          </Link>
          <Text style={paragraph}>
            If you have any questions or need assistance, please don&apos;t
            hesitate to contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "50px",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "100%",
  marginTop: "20px",
};
