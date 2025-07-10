import express from 'express';
import { body } from 'express-validator';
import axios from 'axios';

import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Connect WhatsApp Account
router.post('/connect', authenticate, [
  body('accessToken').exists(),
  body('phoneNumberId').exists(),
  body('businessAccountId').exists(),
], validateRequest, async (req: AuthRequest, res) => {
  try {
    const { accessToken, phoneNumberId, businessAccountId } = req.body;

    // Verify the access token with WhatsApp API
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${phoneNumberId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const { display_phone_number, verified_name } = response.data;

    // Check if account already exists
    const existingAccount = await prisma.whatsAppAccount.findUnique({
      where: { phoneNumberId }
    });

    if (existingAccount && existingAccount.userId !== req.user!.id) {
      return res.status(409).json({ error: 'Phone number already connected to another account' });
    }

    // Create or update WhatsApp account
    const whatsappAccount = await prisma.whatsAppAccount.upsert({
      where: { phoneNumberId },
      update: {
        accessToken,
        businessAccountId,
        displayName: verified_name,
        status: 'CONNECTED',
        isActive: true
      },
      create: {
        userId: req.user!.id,
        phoneNumberId,
        accessToken,
        businessAccountId,
        displayName: verified_name,
        status: 'CONNECTED',
        isActive: true
      }
    });

    res.json({
      message: 'WhatsApp account connected successfully',
      account: {
        id: whatsappAccount.id,
        phoneNumberId: whatsappAccount.phoneNumberId,
        displayName: whatsappAccount.displayName,
        status: whatsappAccount.status
      }
    });
  } catch (error) {
    console.error('WhatsApp connection error:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid WhatsApp access token' });
    }
    
    res.status(500).json({ error: 'Failed to connect WhatsApp account' });
  }
});

// Get WhatsApp Accounts
router.get('/accounts', authenticate, async (req: AuthRequest, res) => {
  try {
    const accounts = await prisma.whatsAppAccount.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        phoneNumberId: true,
        displayName: true,
        status: true,
        isActive: true,
        createdAt: true
      }
    });

    res.json(accounts);
  } catch (error) {
    console.error('Get WhatsApp accounts error:', error);
    res.status(500).json({ error: 'Failed to get WhatsApp accounts' });
  }
});

// Send Message
router.post('/send-message', authenticate, [
  body('phoneNumberId').exists(),
  body('to').exists(),
  body('message').exists(),
], validateRequest, async (req: AuthRequest, res) => {
  try {
    const { phoneNumberId, to, message, type = 'text' } = req.body;

    // Get WhatsApp account
    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        phoneNumberId,
        userId: req.user!.id,
        isActive: true
      }
    });

    if (!whatsappAccount) {
      return res.status(404).json({ error: 'WhatsApp account not found' });
    }

    // Find or create contact
    let contact = await prisma.contact.findFirst({
      where: {
        userId: req.user!.id,
        phone: to
      }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          userId: req.user!.id,
          phone: to,
          source: 'API'
        }
      });
    }

    // Send message via WhatsApp API
    const whatsappResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type,
        text: type === 'text' ? { body: message } : undefined
      },
      {
        headers: {
          'Authorization': `Bearer ${whatsappAccount.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Save message to database
    const savedMessage = await prisma.message.create({
      data: {
        userId: req.user!.id,
        whatsappAccountId: whatsappAccount.id,
        contactId: contact.id,
        direction: 'OUTBOUND',
        type: type.toUpperCase(),
        content: message,
        status: 'SENT',
        whatsappMessageId: whatsappResponse.data.messages[0].id
      }
    });

    res.json({
      message: 'Message sent successfully',
      messageId: savedMessage.id,
      whatsappMessageId: whatsappResponse.data.messages[0].id
    });
  } catch (error) {
    console.error('Send message error:', error);
    
    if (axios.isAxiosError(error)) {
      return res.status(400).json({ 
        error: 'Failed to send message',
        details: error.response?.data
      });
    }
    
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Webhook for receiving messages
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { entry } = req.body;

    for (const entryItem of entry) {
      const { changes } = entryItem;

      for (const change of changes) {
        if (change.field === 'messages') {
          const { messages, statuses } = change.value;

          // Handle incoming messages
          if (messages) {
            for (const message of messages) {
              await handleIncomingMessage(message, change.value.metadata.phone_number_id);
            }
          }

          // Handle message status updates
          if (statuses) {
            for (const status of statuses) {
              await handleMessageStatus(status);
            }
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

async function handleIncomingMessage(message: any, phoneNumberId: string) {
  try {
    // Find WhatsApp account
    const whatsappAccount = await prisma.whatsAppAccount.findUnique({
      where: { phoneNumberId }
    });

    if (!whatsappAccount) {
      console.error('WhatsApp account not found for phone number:', phoneNumberId);
      return;
    }

    // Find or create contact
    let contact = await prisma.contact.findFirst({
      where: {
        userId: whatsappAccount.userId,
        phone: message.from
      }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          userId: whatsappAccount.userId,
          phone: message.from,
          source: 'WHATSAPP'
        }
      });
    }

    // Save message
    await prisma.message.create({
      data: {
        userId: whatsappAccount.userId,
        whatsappAccountId: whatsappAccount.id,
        contactId: contact.id,
        direction: 'INBOUND',
        type: message.type.toUpperCase(),
        content: message.text?.body || message.caption || '',
        status: 'DELIVERED',
        whatsappMessageId: message.id,
        mediaUrl: message.image?.link || message.document?.link || message.audio?.link
      }
    });

    // TODO: Trigger AI chatbot response if enabled
    // TODO: Trigger flow automation if applicable
  } catch (error) {
    console.error('Handle incoming message error:', error);
  }
}

async function handleMessageStatus(status: any) {
  try {
    const { id, status: messageStatus, timestamp } = status;

    const updateData: any = {};

    switch (messageStatus) {
      case 'delivered':
        updateData.status = 'DELIVERED';
        updateData.deliveredAt = new Date(parseInt(timestamp) * 1000);
        break;
      case 'read':
        updateData.status = 'READ';
        updateData.readAt = new Date(parseInt(timestamp) * 1000);
        break;
      case 'failed':
        updateData.status = 'FAILED';
        updateData.errorMessage = status.errors?.[0]?.title || 'Message failed';
        break;
    }

    await prisma.message.updateMany({
      where: { whatsappMessageId: id },
      data: updateData
    });
  } catch (error) {
    console.error('Handle message status error:', error);
  }
}

export default router;