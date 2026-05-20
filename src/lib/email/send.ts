import { Resend } from "resend";
import type { ReactElement } from "react";

let _client: Resend | null = null;

function client(): Resend {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  _client = new Resend(key);
  return _client;
}

type SendEmailParams = {
  to: string | string[];
  subject: string;
  react?: ReactElement;
  html?: string;
  text?: string;
  replyTo?: string | string[];
};

export async function sendEmail(params: SendEmailParams) {
  const from = process.env.RESEND_FROM;
  if (!from) {
    throw new Error("RESEND_FROM is not set");
  }
  if (!params.react && !params.html && !params.text) {
    throw new Error("sendEmail requires one of: react, html, or text");
  }

  const { data, error } = await client().emails.send({
    from,
    to: params.to,
    subject: params.subject,
    react: params.react,
    html: params.html,
    text: params.text,
    replyTo: params.replyTo,
  } as Parameters<Resend["emails"]["send"]>[0]);

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }
  return data;
}
