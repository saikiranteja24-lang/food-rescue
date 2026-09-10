import axios from 'axios';

/**
 * Clean & normalize phone number for WhatsApp
 * Strips special chars and adds default country dial code if needed
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d+]/g, '');
  // If starts with 0, replace with international prefix (default India +91 or US +1 depending on length)
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '91' + cleaned; // default 10-digit to +91
  }
  return cleaned.replace('+', '');
};

/**
 * Generate a branded RePlate WhatsApp Message
 */
export const buildWhatsAppMessage = ({
  name,
  role,
  organizationName,
  type = 'login', // 'login' | 'register' | 'claim' | 'alert'
  siteUrl = 'https://replate-rescue.org',
  customNote = '',
}) => {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
  });

  const header = `🌿 *REPLATE FOOD RESCUE AI* 🍲\n_Connecting Donors & Community Shelters_\n━━━━━━━━━━━━━━━━━━━━━━━━`;

  if (type === 'register') {
    return `${header}
🎉 *Welcome to Replate, ${name || 'Receiver'}!*

Your account has been registered successfully.

👤 *Role*: ${role ? role.toUpperCase() : 'RECIPIENT / NGO'}
🏢 *Organization*: ${organizationName || 'Community Food Receiver'}
🕒 *Registered*: ${timestamp}

✨ *What you can do now*:
1️⃣ Browse live surplus meals & bakery batches
2️⃣ Get instant AI food shelf-life & safety advice
3️⃣ Reserve food for your old age home, orphanage, or shelter

🔗 *Open Marketplace*: ${siteUrl}/donations
💬 *Ask AI Food Advisor*: ${siteUrl}/chat

Thank you for being a vital pillar in eradicating hunger! 💚
━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  if (type === 'claim') {
    return `${header}
📦 *Food Rescue Pickup Reserved!*

Hello *${name || 'Receiver'}*, your surplus meal request has been confirmed.

${customNote ? `ℹ️ *Details*: ${customNote}\n` : ''}🕒 *Time*: ${timestamp}
📍 *Next Step*: Please coordinate pickup at the designated time window.

🔗 *View Active Claims*: ${siteUrl}/dashboard

Together for zero food waste! 🌿
━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  // Default: Login / Sign In notification
  return `${header}
🔔 *Security & Login Alert*

Hello *${name || 'Receiver'}*, you have successfully signed in to *Replate*.

👤 *Account Role*: ${role ? role.toUpperCase() : 'RECIPIENT'}
🏢 *Receiver Profile*: ${organizationName || 'Community Partner'}
🕒 *Sign-in Time*: ${timestamp}
🛡️ *Status*: Active Session

🚀 *Quick Links*:
• 🍱 *Find Surplus Food*: ${siteUrl}/donations
• 🤖 *Replate AI Advisor*: ${siteUrl}/chat
• 📊 *Receiver Dashboard*: ${siteUrl}/dashboard

_If this was not you, please secure your account immediately._
━━━━━━━━━━━━━━━━━━━━━━━━`;
};

/**
 * Dispatches WhatsApp Notification (Supports Direct Link, Twilio & Cloud API)
 */
export const sendWhatsAppNotification = async ({
  phone,
  name,
  role,
  organizationName,
  type = 'login',
  customNote = '',
}) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const message = buildWhatsAppMessage({
      name,
      role,
      organizationName,
      type,
      customNote,
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappDeepLink = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    const whatsappWebLink = formattedPhone
      ? `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?text=${encodedMessage}`;

    // Optional: Twilio WhatsApp integration if environment variables are set
    let apiStatus = 'deep_link_ready';
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM &&
      formattedPhone
    ) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
        const auth = Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString('base64');

        const params = new URLSearchParams();
        params.append('From', `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`);
        params.append('To', `whatsapp:+${formattedPhone}`);
        params.append('Body', message);

        await axios.post(twilioUrl, params.toString(), {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        apiStatus = 'sent_via_twilio';
        console.log(`[WhatsApp Service] Sent real-time message to +${formattedPhone} via Twilio`);
      } catch (twilioErr) {
        console.warn('[WhatsApp Service] Twilio API dispatch failed, fallback to deep link:', twilioErr.message);
      }
    }

    console.log(`[WhatsApp Notification Created] Type: ${type} | User: ${name} (${role}) | Phone: ${formattedPhone || 'N/A'}`);

    return {
      success: true,
      apiStatus,
      recipient: {
        name,
        role,
        phone: formattedPhone,
      },
      message,
      whatsappDeepLink,
      whatsappWebLink,
      sentAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[WhatsApp Service Error]:', err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};
