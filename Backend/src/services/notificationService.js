import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import MonitoredSite from '../models/MonitoredSite.js';

// Initialize clients
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendDownAlert = async (siteId) => {
  try {
    // 1. Find the site and populate its owner's details
    const site = await MonitoredSite.findById(siteId).populate('ownerId');

    if (!site || !site.ownerId) {
      console.log(`Could not find site or owner for siteId: ${siteId}`);
      return;
    }

    const owner = site.ownerId;
    const siteUrl = site.url;

    // 2. Check the site's notification preferences
    
    // 3. Send email if enabled
    if (site.notifyByEmail) {
      const msg = {
        to: owner.email,
        from: process.env.SENDGRID_FROM_EMAIL, // Use a verified sender
        subject: `🚨 Alert: Your site ${site.name} is down!`,
        text: `We detected that your website at ${siteUrl} is currently down. Please check your server.`,
        html: `<strong>We detected that your website at ${siteUrl} is currently down.</strong><p>Please check your server.</p>`,
      };
      await sgMail.send(msg);
      console.log(`Email alert sent to ${owner.email} for site ${siteUrl}`);
    }

    // 4. Send WhatsApp message if enabled and phone number exists
    if (site.notifyBySms && owner.phone) {
      const messageBody = `🚨 Alert: Your website ${siteUrl} appears to be down.`;
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${owner.phone}`, // User's phone number with country code
        body: messageBody,
      });
      console.log(`WhatsApp alert sent to ${owner.phone} for site ${siteUrl}`);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};