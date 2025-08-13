import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { reservationData } = await req.json();

    if (!reservationData) {
      return NextResponse.json(
        { success: false, error: 'Missing reservation data' },
        { status: 400 }
      );
    }

    // The three email addresses to notify
    const notificationEmails = [
      'contact@eastatwest.com',
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com'
    ];

    const subject = 'New Reservation Received – East@West';

    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Reservation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">East at West</h1>
            <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 16px;">Restaurant & Take-Away</p>
          </div>

          <!-- Status Banner -->
          <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
              NEW RESERVATION RECEIVED
            </h2>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Reservation Details</h3>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Name</p>
                  <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 600;">${reservationData.name}</p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Email</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;"><a href="mailto:${reservationData.email}" style="color: #374151; text-decoration: none;">${reservationData.email}</a></p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Phone</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;"><a href="tel:${reservationData.phone}" style="color: #374151; text-decoration: none;">${reservationData.phone}</a></p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Date</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;">${new Date(reservationData.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Time</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;">${reservationData.startTime} - ${reservationData.endTime}</p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Number of People</p>
                  <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 600;">${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
            </div>

            ${reservationData.specialRequests ? `
            <!-- Special Requests -->
            <div style="margin-bottom: 30px;">
              <h4 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Special Requests</h4>
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6;">${reservationData.specialRequests}</p>
              </div>
            </div>
            ` : ''}

            <!-- Action Required -->
            <div style="background-color: ${reservationData.guests >= 7 ? '#fef3c7' : '#dcfce7'}; padding: 20px; border-radius: 8px; border-left: 4px solid ${reservationData.guests >= 7 ? '#f59e0b' : '#10b981'}; margin-bottom: 30px;">
              <h4 style="color: ${reservationData.guests >= 7 ? '#92400e' : '#065f46'}; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Status</h4>
              <p style="color: ${reservationData.guests >= 7 ? '#92400e' : '#065f46'}; margin: 0; font-size: 14px; line-height: 1.6;">
                ${reservationData.guests >= 7 ? 
                  'This reservation requires approval (7+ guests). Please check the reservation system and contact the client if needed.' :
                  'This reservation has been automatically confirmed. No action required unless there are conflicts.'
                }
              </p>
            </div>

            <!-- Action Instructions -->
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
              <h4 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Next Steps</h4>
              <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li>Check the reservation system for any conflicts</li>
                <li>Contact the client if needed: <a href="tel:${reservationData.phone}" style="color: #3b82f6;">${reservationData.phone}</a></li>
                <li>Send confirmation or update the reservation status in the admin panel</li>
                ${reservationData.guests >= 7 ? '<li style="font-weight: 600; color: #dc2626;">Approval required for this large group reservation</li>' : ''}
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #d1d5db; margin: 0; font-size: 14px;">
              East@West Restaurant Management System
            </p>
            <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
              Bld de l'Empereur 26, 1000 Brussels, Belgium
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
New Reservation Received – East@West

Hello,

A new reservation has been submitted through the website. Here are the details:

Name: ${reservationData.name}
Phone: ${reservationData.phone}
Email: ${reservationData.email}
Date: ${new Date(reservationData.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${reservationData.startTime} - ${reservationData.endTime}
Number of People: ${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}
${reservationData.specialRequests ? `Special Requests: ${reservationData.specialRequests}` : ''}

${reservationData.guests >= 7 ? 
  'APPROVAL REQUIRED: This reservation requires approval (7+ guests). Please check the reservation system and contact the client if needed.' :
  'STATUS: This reservation has been automatically confirmed.'
}

Please check the reservation system or contact the client if needed.

East@West Restaurant
Bld de l'Empereur 26, 1000 Brussels, Belgium
`;

    // Send emails to all notification addresses
    const emailPromises = notificationEmails.map(email => 
      sendEmail({
        from: process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || 'contact@eastatwest.com',
        to: email,
        subject,
        text: emailText,
        html: emailHTML,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'X-Mailer': 'East at West Restaurant'
        }
      })
    );

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);
    
    // Log results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Notification email sent to ${notificationEmails[index]}`);
      } else {
        console.error(`Failed to send notification email to ${notificationEmails[index]}:`, result.reason);
      }
    });

    // Return success if at least one email was sent
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    if (successCount > 0) {
      return NextResponse.json({ success: true, message: `Notification emails sent to ${successCount}/${notificationEmails.length} addresses` });
    }
    return NextResponse.json({ success: false, error: 'Failed to send notification emails' }, { status: 500 });

  } catch (error) {
    console.error('Error sending notification emails:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 