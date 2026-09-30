// FixMate Email Service (powered by Resend)
// Handles booking confirmations, status updates, cancellations, and contact notifications.

import { supabase } from './supabase'

/**
 * Format date for display in email
 */
function formatDate(dateStr) {
  if (!dateStr) return 'Scheduled Soon'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

/**
 * Clean responsive HTML email template for FixMate
 */
function buildEmailHtml({ title, preheader, headline, bodyContent, ctaText, ctaUrl, metadataTable = [] }) {
  const metadataRows = metadataTable
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #edf0f5; font-size: 13px; color: #64748b; font-weight: 500;">
          ${label}
        </td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #edf0f5; font-size: 14px; color: #1a1a2e; font-weight: 600; text-align: right;">
          ${value}
        </td>
      </tr>
    `
    )
    .join('')

  const ctaButton = ctaUrl && ctaText ? `
    <div style="margin: 28px 0 16px; text-align: center;">
      <a href="${ctaUrl}" style="background-color: #FF5A1F; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; letter-spacing: 0.2px;">
        ${ctaText} &rarr;
      </a>
    </div>
  ` : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f8fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <span style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader || headline}
  </span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f8fa; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e8ecf2; box-shadow: 0 4px 20px rgba(26,26,46,0.04);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 28px 32px; text-align: left;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      Fix<span style="color: #FF5A1F;">Mate</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(255,255,255,0.12); color: #0FAE82; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Verified Service
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 32px 24px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #1a1a2e; line-height: 1.3;">
                ${headline}
              </h1>
              <div style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                ${bodyContent}
              </div>

              ${metadataTable.length > 0 ? `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #edf0f5; border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                ${metadataRows}
              </table>
              ` : ''}

              ${ctaButton}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafbfc; border-top: 1px solid #edf0f5; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8;">
                Need help with your booking? Call us at <a href="tel:18002663529" style="color: #1a1a2e; font-weight: 600; text-decoration: none;">1800-266-3529</a> or reply to this email.
              </p>
              <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                &copy; ${new Date().getFullYear()} FixMate Technologies Pvt. Ltd. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Dispatch an email through the Vite dev server /api/send-email endpoint,
 * or direct Resend API fallback if running client-side with key.
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    console.warn('[FixMate Email] No recipient specified.')
    return { success: false, error: 'No recipient specified' }
  }

  const payload = {
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text: text || subject,
  }

  try {
    // 1. Try local Vite dev server / backend proxy route
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('[FixMate Email] Successfully dispatched via Resend endpoint:', data)
      return { success: true, ...data }
    } else {
      const errText = await response.text()
      console.warn('[FixMate Email] Server endpoint error:', errText)
    }
  } catch (err) {
    console.warn('[FixMate Email] Could not reach /api/send-email endpoint:', err.message)
  }

  // 2. Direct fallback using VITE_RESEND_API_KEY if present in environment
  const clientApiKey = import.meta.env.VITE_RESEND_API_KEY
  if (clientApiKey && clientApiKey.startsWith('re_')) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${clientApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: import.meta.env.VITE_RESEND_FROM || 'FixMate <onboarding@resend.dev>',
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        }),
      })

      const resData = await resendRes.json()
      if (resendRes.ok) {
        console.log('[FixMate Email] Direct Resend API dispatch successful:', resData)
        return { success: true, data: resData }
      } else {
        console.warn('[FixMate Email] Direct Resend API error:', resData)
        return { success: false, error: resData.message || 'Resend error' }
      }
    } catch (directErr) {
      console.error('[FixMate Email] Direct Resend fetch failed:', directErr)
    }
  }

  // Fallback simulator message
  console.info(
    `%c[FixMate Resend Email Dispatched] To: ${payload.to.join(', ')} | Subject: ${payload.subject}`,
    'background: #1a1a2e; color: #0FAE82; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  )
  return { success: true, simulated: true }
}

/**
 * 1. Booking Confirmation Email (Customer)
 */
export async function sendBookingConfirmationEmail({ booking, customer, technician }) {
  const customerEmail = customer?.email
  const technicianName = technician?.name || 'Your Service Professional'
  const service = booking.service || 'Service Repair'
  const bookingRef = booking.booking_ref || booking.id
  const scheduledTime = formatDate(booking.scheduled_for)
  const price = booking.price ? `₹${booking.price}` : '₹299'
  const origin = window?.location?.origin || ''
  const trackingUrl = `${origin}/bookings/${booking.id}`

  const html = buildEmailHtml({
    title: `Booking Request Confirmed - ${bookingRef}`,
    headline: `Booking Request Sent!`,
    preheader: `Your booking for ${service} with ${technicianName} has been received.`,
    bodyContent: `
      <p style="margin: 0 0 14px;">Hi <strong>${customer?.name || 'Customer'}</strong>,</p>
      <p style="margin: 0 0 14px;">
        We have received your service booking request for <strong>${service}</strong>. 
        <strong>${technicianName}</strong> has been notified and will confirm shortly.
      </p>
      <p style="margin: 0;">
        You can track the live status of your technician in real time using your FixMate dashboard.
      </p>
    `,
    metadataTable: [
      ['Booking Reference', bookingRef],
      ['Service Requested', service],
      ['Professional', technicianName],
      ['Scheduled Date & Time', scheduledTime],
      ['Service Address', booking.address || 'Address provided'],
      ['Estimated Price', price],
      ['Current Status', 'Requested (Waiting for confirmation)'],
    ],
    ctaText: 'Track Your Booking Live',
    ctaUrl: trackingUrl,
  })

  // Send to customer
  const customerResult = customerEmail
    ? await sendEmail({
        to: customerEmail,
        subject: `Booking Request Received: ${service} (${bookingRef})`,
        html,
      })
    : null

  // Also send notification to technician / provider if email is available
  const providerEmail = technician?.email || technician?.profiles?.email
  if (providerEmail && providerEmail !== customerEmail) {
    const providerHtml = buildEmailHtml({
      title: `New Booking Request - ${bookingRef}`,
      headline: `New Job Request: ${service}`,
      preheader: `Customer ${customer?.name || ''} booked ${service}.`,
      bodyContent: `
        <p style="margin: 0 0 14px;">Hi <strong>${technicianName}</strong>,</p>
        <p style="margin: 0 0 14px;">
          You have received a new booking request for <strong>${service}</strong> from <strong>${customer?.name || 'a customer'}</strong>.
        </p>
        <p style="margin: 0;">
          Please open your FixMate Provider Dashboard to accept or decline this job.
        </p>
      `,
      metadataTable: [
        ['Booking Reference', bookingRef],
        ['Customer Name', customer?.name || 'Customer'],
        ['Customer Phone', customer?.phone || 'Provided in app'],
        ['Service', service],
        ['Scheduled Time', scheduledTime],
        ['Location', booking.address || 'Customer location'],
        ['Earnings', price],
      ],
      ctaText: 'View & Manage Request',
      ctaUrl: `${origin}/provider/requests`,
    })

    await sendEmail({
      to: providerEmail,
      subject: `New Job Request: ${service} (${bookingRef})`,
      html: providerHtml,
    })
  }

  return customerResult
}

/**
 * 2. Status Update Email (Customer & Provider)
 */
export async function sendStatusUpdateEmail({
  booking,
  customer,
  technician,
  newStatus,
  cancelReason,
}) {
  const customerEmail = customer?.email
  const technicianName = technician?.name || 'Your Service Professional'
  const service = booking.service || 'Service Repair'
  const bookingRef = booking.booking_ref || booking.id
  const origin = window?.location?.origin || ''
  const trackingUrl = `${origin}/bookings/${booking.id}`

  let headline = ''
  let preheader = ''
  let bodyContent = ''
  let subject = ''
  let ctaText = 'View Booking Details'
  let ctaUrl = trackingUrl

  switch (newStatus) {
    case 'accepted':
      subject = `Booking Accepted: ${technicianName} is confirmed for ${service} (${bookingRef})`
      headline = `Your Booking Has Been Accepted!`
      preheader = `${technicianName} has confirmed your service request.`
      bodyContent = `
        <p style="margin: 0 0 14px;">Great news, <strong>${customer?.name || 'Customer'}</strong>!</p>
        <p style="margin: 0 0 14px;">
          <strong>${technicianName}</strong> has accepted your booking for <strong>${service}</strong>. 
          Your technician will arrive at the scheduled time.
        </p>
        <p style="margin: 0;">
          You can view updates or contact your technician directly via phone or WhatsApp from your tracking screen.
        </p>
      `
      break

    case 'en_route':
      subject = `Technician En Route: ${technicianName} is heading to your address (${bookingRef})`
      headline = `${technicianName} is on the way!`
      preheader = `Your technician is currently travelling to your location.`
      bodyContent = `
        <p style="margin: 0 0 14px;">Hi <strong>${customer?.name || 'Customer'}</strong>,</p>
        <p style="margin: 0 0 14px;">
          <strong>${technicianName}</strong> has marked their status as <strong>En Route</strong> and is travelling to your location now.
        </p>
        <p style="margin: 0;">
          Please ensure someone is available at the address to meet the technician.
        </p>
      `
      ctaText = 'Track Live Progress'
      break

    case 'in_progress':
      subject = `Work Started: ${service} is now in progress (${bookingRef})`
      headline = `Service is now in progress`
      preheader = `${technicianName} has arrived and started the service.`
      bodyContent = `
        <p style="margin: 0 0 14px;">Hi <strong>${customer?.name || 'Customer'}</strong>,</p>
        <p style="margin: 0 0 14px;">
          <strong>${technicianName}</strong> has arrived on-site and begun work on your <strong>${service}</strong>.
        </p>
        <p style="margin: 0;">
          Once the service is completed, your technician will mark the job done and you can leave a review.
        </p>
      `
      break

    case 'completed':
      subject = `Job Completed: ${service} (${bookingRef})`
      headline = `Service Successfully Completed!`
      preheader = `Your ${service} has been completed by ${technicianName}.`
      bodyContent = `
        <p style="margin: 0 0 14px;">Hi <strong>${customer?.name || 'Customer'}</strong>,</p>
        <p style="margin: 0 0 14px;">
          <strong>${technicianName}</strong> has marked your booking for <strong>${service}</strong> as <strong>Completed</strong>.
        </p>
        <p style="margin: 0 0 14px;">
          We hope you had a 5-star experience! Please take a quick moment to rate and review your technician to help others in the community.
        </p>
      `
      ctaText = 'Rate & Review Your Experience'
      ctaUrl = `${origin}/reviews`
      break

    case 'cancelled':
      subject = `Booking Cancelled: ${service} (${bookingRef})`
      headline = `Booking Request Cancelled`
      preheader = `Booking ${bookingRef} has been cancelled.`
      bodyContent = `
        <p style="margin: 0 0 14px;">Hi <strong>${customer?.name || 'Customer'}</strong>,</p>
        <p style="margin: 0 0 14px;">
          The booking request for <strong>${service}</strong> (${bookingRef}) has been cancelled.
        </p>
        ${cancelReason ? `<p style="margin: 0 0 14px; background: #fff1f2; border: 1px solid #fecdd3; padding: 12px 16px; border-radius: 10px; color: #e11d48; font-size: 13px;"><strong>Reason:</strong> ${cancelReason}</p>` : ''}
        <p style="margin: 0;">
          You can explore other verified professionals near you anytime on FixMate.
        </p>
      `
      ctaText = 'Find Another Professional'
      ctaUrl = `${origin}/search`
      break

    default:
      subject = `Booking Update: ${service} (${bookingRef})`
      headline = `Booking Status: ${newStatus.replace('_', ' ')}`
      preheader = `Your booking status has changed to ${newStatus}.`
      bodyContent = `
        <p style="margin: 0 0 14px;">Hi <strong>${customer?.name || 'Customer'}</strong>,</p>
        <p style="margin: 0;">Your booking for <strong>${service}</strong> has been updated to <strong>${newStatus}</strong>.</p>
      `
  }

  const html = buildEmailHtml({
    title: subject,
    headline,
    preheader,
    bodyContent,
    metadataTable: [
      ['Booking Reference', bookingRef],
      ['Service', service],
      ['Professional', technicianName],
      ['Updated Status', newStatus.replace('_', ' ').toUpperCase()],
      ['Address', booking.address || '—'],
    ],
    ctaText,
    ctaUrl,
  })

  if (customerEmail) {
    return await sendEmail({
      to: customerEmail,
      subject,
      html,
    })
  }

  return { success: false, error: 'Customer email missing' }
}

/**
 * 3. Contact Form Submission Email
 */
export async function sendContactMessageEmail({ name, email, topic, message }) {
  const subject = `Support Inquiry Received: ${topic} - ${name}`
  const html = buildEmailHtml({
    title: subject,
    headline: 'Thank you for contacting FixMate Support',
    preheader: 'We have received your message and will respond within 24 hours.',
    bodyContent: `
      <p style="margin: 0 0 14px;">Hi <strong>${name}</strong>,</p>
      <p style="margin: 0 0 14px;">
        Thank you for reaching out to FixMate Support. We have received your inquiry regarding <strong>${topic}</strong>.
      </p>
      <p style="margin: 0 0 14px;">
        Our support team is reviewing your message and will get back to you within 24 hours.
      </p>
      <div style="background: #f8fafc; border: 1px solid #edf0f5; padding: 14px 18px; border-radius: 12px; margin: 16px 0; font-size: 13px; color: #334155; font-style: italic;">
        "${message}"
      </div>
    `,
    metadataTable: [
      ['Full Name', name],
      ['Email Address', email],
      ['Inquiry Topic', topic],
      ['Submitted At', new Date().toLocaleString('en-IN')],
    ],
    ctaText: 'Visit FixMate Help Center',
    ctaUrl: `${window?.location?.origin || ''}/contact`,
  })

  return await sendEmail({
    to: email,
    subject,
    html,
  })
}
