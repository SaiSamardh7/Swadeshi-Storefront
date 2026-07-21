// ponytail: no SMS provider wired yet — codes are logged instead of texted.
// Swap this for Twilio (or AWS SNS) once the owner has an account; nothing
// else in the auth flow changes.
export async function sendOtpSms(phone: string, code: string): Promise<void> {
  console.log(`[otp:dev] to=${phone} code=${code}`);
}
