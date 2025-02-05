import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail(to: string, inviteLink: string, senderName: string, isAnonymous: boolean) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  try {
    const { data, error } = await resend.emails.send({
      from: "Your Valentine <noreply@getadate.ink>",
      to: [to],
      subject: "You have a Valentine's Invite!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You've Received a Valentine's Invite!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF0F5; border-radius: 10px; overflow: hidden;">
            <tr>
              <td style="padding: 40px 20px; text-align: center;">
                <h1 style="color: #FF1493; margin-bottom: 20px;">You've Received a Valentine's Invite!</h1>
                <p style="font-size: 18px; margin-bottom: 30px;">
                  ${isAnonymous ? "Someone special" : senderName} has sent you a Valentine's invite.
                </p>
                <a href="${appUrl}/${inviteLink}" style="background-color: #FF1493; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
                  View Your Valentine's Invite
                </a>
                <p style="font-size: 16px; color: #666;">
                  Click the button above or use this link:<br>
                  <a href="${appUrl}/${inviteLink}" style="color: #FF1493; word-break: break-all;">
                    ${appUrl}/${inviteLink}
                  </a>
                </p>
              </td>
            </tr>
          </table>
          <p style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">
            This is an automated message from Your Valentine. Please do not reply to this email.
          </p>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return false
    }

    console.log("Email sent successfully:", data)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

/*
export async function sendResponseNotificationEmail(
  to: string,
  recipientName: string,
  response: string,
  inviteLink: string,
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  try {
    const { data, error } = await resend.emails.send({
      from: "Your Valentine <noreply@getadate.ink>",
      to: [to],
      subject: `${recipientName} has responded to your Valentine's Invite!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${recipientName} has responded to your Valentine's Invite!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF0F5; border-radius: 10px; overflow: hidden;">
            <tr>
              <td style="padding: 40px 20px; text-align: center;">
                <h1 style="color: #FF1493; margin-bottom: 20px;">Valentine's Invite Response</h1>
                <p style="font-size: 18px; margin-bottom: 30px;">
                  Great news! ${recipientName} has responded to your Valentine's invite.
                </p>
                <p style="font-size: 24px; font-weight: bold; color: #FF1493; margin-bottom: 30px;">
                  Their response: ${response}
                </p>
                <a href="${appUrl}/${inviteLink}" style="background-color: #FF1493; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
                  View Your Valentine's Invite
                </a>
                <p style="font-size: 16px; color: #666;">
                  Click the button above or use this link to view the invite:<br>
                  <a href="${appUrl}/${inviteLink}" style="color: #FF1493; word-break: break-all;">
                    ${appUrl}/${inviteLink}
                  </a>
                </p>
              </td>
            </tr>
          </table>
          <p style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">
            This is an automated message from Your Valentine. Please do not reply to this email.
          </p>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error sending response notification email:", error)
      return false
    }

    console.log("Response notification email sent successfully:", data)
    return true
  } catch (error) {
    console.error("Error sending response notification email:", error)
    return false
  }
}
*/