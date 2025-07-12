import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, projectType, message } =
      await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Correct transporter creation
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #e11d48, #1e40af); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; text-align: center; font-size: 24px;">New Contact Form Submission</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #e11d48; padding-bottom: 10px;">Contact Details</h2>

            <div style="margin-bottom: 15px;">
              <strong style="color: #374151; display: inline-block; width: 120px;">Name:</strong>
              <span style="color: #1f2937;">${firstName} ${lastName}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #374151; display: inline-block; width: 120px;">Email:</strong>
              <a href="mailto:${email}" style="color: #1e40af; text-decoration: none;">${email}</a>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #374151; display: inline-block; width: 120px;">Project Type:</strong>
              <span style="color: #1f2937;">${projectType}</span>
            </div>

            <div style="margin-bottom: 20px;">
              <strong style="color: #374151; display: block; margin-bottom: 10px;">Message:</strong>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #e11d48;">
                <p style="color: #1f2937; margin: 0; line-height: 1.6;">${message}</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                This email was sent from your portfolio contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Portfolio Contact Form | Alex Chen
            </p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission

        Name: ${firstName} ${lastName}
        Email: ${email}
        Project Type: ${projectType}

        Message:
        ${message}

        Sent on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
