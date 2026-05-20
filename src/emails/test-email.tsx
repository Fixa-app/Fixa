import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function TestEmail({
  recipientEmail,
}: {
  recipientEmail: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Resend is wired up correctly.</Preview>
      <Body
        style={{
          backgroundColor: "#f6f6f6",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            margin: "0 auto",
            maxWidth: "560px",
            padding: "32px",
          }}
        >
          <Heading style={{ fontSize: "20px", margin: "0 0 12px" }}>
            Test from Fixa
          </Heading>
          <Section>
            <Text style={{ color: "#444", lineHeight: "1.5" }}>
              This is a test email sent to <strong>{recipientEmail}</strong>.
            </Text>
            <Text style={{ color: "#444", lineHeight: "1.5" }}>
              If it landed in your inbox, Resend is wired up correctly and the
              Fixa platform can send mail from <code>hifixa.com</code>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
