import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const getDomain = process.env.PUBLIC_APP_URL;
export const sendVerificationEmail = async (email, token) => {
  const linkToConfirm = `${getDomain}/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.FROM_EMAIL_FIELD,
    to: email,
    subject: "Please confirm your email",
    html: `<p>Please click <a href="${linkToConfirm}">here</a> to confirm your email</p>`,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetPasswordLink = `${getDomain}/new-password?token=${token}`;

  await resend.emails.send({
    from: process.env.FROM_EMAIL_FIELD,
    to: email,
    subject: "Please reset your password here.",
    html: `<p>Please click <a href="${resetPasswordLink}">here</a> to reset your password</p>`,
  });
};
