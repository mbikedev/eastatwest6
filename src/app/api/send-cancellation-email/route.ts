import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Translation function to get keys from JSON files
function getTranslation(language: string, key: string): string {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', language, 'common.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    // Navigate through nested keys (e.g., "reservations.form.name")
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  } catch (error) {
    console.error(`Translation error for ${language}.${key}:`, error);
    return key;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, language, reservationData } = await req.json();

    if (!email || !language || !reservationData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validLanguages = ['en', 'fr', 'nl'] as const;
    type Language = typeof validLanguages[number];
    const lang: Language = validLanguages.includes(language as Language) ? (language as Language) : 'en';

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const subject = getTranslation(lang, 'reservations.cancelled');

    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@eastatwest.com',
      to: email,
      subject,
      text: `Reservation Cancelled - Invoice: ${reservationData.invoice_number}`,
      html: `
        <!DOCTYPE html>
        <html lang="${lang}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Cancelled</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">East at West</h1>
              <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 16px;">Restaurant & Take-Away</p>
            </div>

            <!-- Status Banner -->
            <div style="background-color: #ef4444; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ${getTranslation(lang, 'reservations.cancelled')}
              </h2>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <!-- Invoice Number -->
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ef4444;">
                <h3 style="color: #991b1b; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">${getTranslation(lang, 'reservations.invoiceNumber')}</h3>
                <p style="color: #dc2626; margin: 0; font-size: 16px; font-family: 'Courier New', monospace; font-weight: bold;">
                  ${reservationData.invoice_number}
                </p>
              </div>

              <!-- Cancelled Reservation Details -->
              <div style="margin-bottom: 30px;">
                <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">${getTranslation(lang, 'reservations.cancelledDetails')}</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">${getTranslation(lang, 'reservations.form.name')}</p>
                    <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 600;">${reservationData.name}</p>
                  </div>
                  
                  <div>
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">${getTranslation(lang, 'reservations.form.date')}</p>
                    <p style="color: #374151; margin: 0; font-size: 16px;">${new Date(reservationData.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Start Time</p>
                    <p style="color: #374151; margin: 0; font-size: 16px;">${reservationData.start_time}</p>
                  </div>
                  
                  <div>
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">End Time</p>
                    <p style="color: #374151; margin: 0; font-size: 16px;">${reservationData.end_time}</p>
                  </div>
                  
                  <div>
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">${getTranslation(lang, 'reservations.form.guests')}</p>
                    <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 600;">${reservationData.guests}</p>
                  </div>
                  
                  <div>
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Status</p>
                    <p style="color: #ef4444; margin: 0; font-size: 16px; font-weight: 600;">${getTranslation(lang, 'reservations.cancelled')}</p>
                  </div>
                </div>
              </div>

              <!-- Cancellation Notice -->
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 30px;">
                <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">${getTranslation(lang, 'reservations.cancellationNotice')}</h4>
                <p style="color: #991b1b; margin: 0; font-size: 14px; line-height: 1.6;">
                  ${getTranslation(lang, 'reservations.cancellationMessage')}
                </p>
              </div>

              <!-- Contact Information -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                <h4 style="color: #374151; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">${getTranslation(lang, 'reservations.info.contact')}</h4>
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">
                  <strong>${getTranslation(lang, 'reservations.form.phone')}:</strong> ${getTranslation(lang, 'reservations.contactPhone')}
                </p>
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">
                  <strong>${getTranslation(lang, 'reservations.form.email')}:</strong> ${getTranslation(lang, 'reservations.contactEmail')}
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  <strong>Address:</strong><br>
                  ${getTranslation(lang, 'reservations.contactAddress').replace(/\n/g, '<br>')}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 30px; text-align: center;">
              <p style="color: #d1d5db; margin: 0 0 10px 0; font-size: 14px;">
                ${getTranslation(lang, 'reservations.thankYouForChoosing')}
              </p>
              <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 12px;">
                ${getTranslation(lang, 'reservations.contactUsForQuestions')}
              </p>
              <div style="border-top: 1px solid #374151; padding-top: 15px;">
                <a href="mailto:unsubscribe@eastatwest.com" style="color: #9ca3af; text-decoration: none; font-size: 12px;">
                  ${getTranslation(lang, 'reservations.unsubscribeFromEmails')}
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'East at West Restaurant'
      }
    });

    console.log('Cancellation email sent successfully:', emailResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 