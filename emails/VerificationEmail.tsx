import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Your verification code is {otp}</p>
    </div>
  );
}
