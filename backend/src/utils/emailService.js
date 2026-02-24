import SendEmail from "../config/email.js";

export const sendOTPEmail = async (to, otp) => {
  const subject = "OTP to reset your HealthNexus Password";

  const message = `
<body style="margin:0; padding:0; background-color:#f2f5f9; font-family: 'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px; background-color:#f2f5f9;">
    <tr>
      <td align="center">

        <table width="620" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 15px 40px rgba(13,110,253,0.15);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 30px; background-color:#0d6efd;">
              <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:600; letter-spacing:0.5px;">
                HealthNexus Security Verification
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:45px 40px; color:#2d3748;">

              <p style="margin:0 0 18px; font-size:16px;">
                Hello,
              </p>

              <p style="margin:0 0 30px; font-size:16px; line-height:1.6; color:#4a5568;">
                We received a request to reset your password.
                Use the One-Time Password (OTP) below to continue securely.
              </p>

              <!-- OTP Section -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="
                      display:inline-block;
                      padding:20px 50px;
                      font-size:34px;
                      letter-spacing:10px;
                      font-weight:700;
                      color:#0d6efd;
                      background-color:#eef4ff;
                      border-radius:14px;
                      border:1px solid #d6e4ff;
                      box-shadow:0 8px 20px rgba(13,110,253,0.15);
                    ">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <div style="margin-top:35px; padding-top:25px; border-top:1px solid #edf2f7;">
                <p style="margin:0 0 10px; font-size:14px; color:#4a5568;">
                  ⏳ This OTP is valid for <strong>5 minutes</strong>.
                </p>

                <p style="margin:0; font-size:14px; color:#718096;">
                  For your security, never share this code with anyone.
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:25px; background-color:#f8fafc;">
              <p style="margin:0; font-size:13px; color:#94a3b8;">
                © ${new Date().getFullYear()} HealthNexus India Pvt. Ltd. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
`;

  await SendEmail(to, subject, message);
};
