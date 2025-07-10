import express from 'express';
import { body, query } from 'express-validator';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Get contacts with pagination and filtering
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('tags').optional().isString(),
], validateRequest, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const tags = req.query.tags as string;

    const skip = (page - 1) * limit;

    const where: any = { userId: req.user!.id };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (tags) {
      const tagNames = tags.split(',');
      where.tags = {
        some: {
          tag: {
            name: { in: tagNames }
          }
        }
      };
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          tags: {
            include: { tag: true }
          },
          attributes: {
            include: { attribute: true }
          },
          _count: {
            select: { messages: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count({ where })
    ]);

    res.json({
      contacts: contacts.map(contact => ({
        ...contact,
        tags: contact.tags.map(ct => ct.tag),
        attributes: contact.attributes.map(ca => ({
          ...ca.attribute,
          value: ca.value
        })),
        messageCount: contact._count.messages
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to get contacts' });
  }
});

// Create contact
router.post('/', authenticate, [
  body('phone').isMobilePhone(),
  body('name').optional().trim().isLength({ min: 1 }),
  body('email').optional().isEmail(),
  body('tags').optional().isArray(),
], validateRequest, async (req: AuthRequest, res) => {
  try {
    const { phone, name, email, tags = [], customFields = {} } = req.body;

    // Check if contact already exists
    const existingContact = await prisma.contact.findFirst({
      where: {
        userId: req.user!.id,
        phone
      }
    });

    if (existingContact) {
      return res.status(409).json({ error: 'Contact already exists' });
    }

    const contact = await prisma.contact.create({
      data: {
        userId: req.user!.id,
        phone,
        name,
        email,
        customFields,
        source: 'MANUAL'
      }
    });

    // Add tags if provided
    if (tags.length > 0) {
      for (const tagName of tags) {
        let tag = await prisma.tag.findFirst({
          where: { name: tagName }
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName }
          });
        }

        await prisma.contactTag.create({
          data: {
            contactId: contact.id,
            tagId: tag.id
          }
        });
      }
    }

    res.status(201).json(contact);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
router.put('/:id', authenticate, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('email').optional().isEmail(),
  body('tags').optional().isArray(),
], validateRequest, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, email, tags, customFields } = req.body;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        customFields
      }
    });

    // Update tags if provided
    if (tags) {
      // Remove existing tags
      await prisma.contactTag.deleteMany({
        where: { contactId: id }
      });

      // Add new tags
      for (const tagName of tags) {
        let tag = await prisma.tag.findFirst({
          where: { name: tagName }
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName }
          });
        }

        await prisma.contactTag.create({
          data: {
            contactId: id,
            tagId: tag.id
          }
        });
      }
    }

    res.json(updatedContact);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await prisma.contact.delete({
      where: { id }
    });

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Get contact by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user!.id
      },
      include: {
        tags: {
          include: { tag: true }
        },
        attributes: {
          include: { attribute: true }
        },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 50
        }
      }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({
      ...contact,
      tags: contact.tags.map(ct => ct.tag),
      attributes: contact.attributes.map(ca => ({
        ...ca.attribute,
        value: ca.value
      }))
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Failed to get contact' });
  }
});

// Bulk import contacts
router.post('/bulk-import', authenticate, [
  body('contacts').isArray({ min: 1 }),
], validateRequest, async (req: AuthRequest, res) => {
  try {
    const { contacts } = req.body;
    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[]
    };

    for (const contactData of contacts) {
      try {
        const { phone, name, email, tags = [] } = contactData;

        // Check if contact exists
        const existingContact = await prisma.contact.findFirst({
          where: {
            userId: req.user!.id,
            phone
          }
        });

        if (existingContact) {
          results.skipped++;
          continue;
        }

        const contact = await prisma.contact.create({
          data: {
            userId: req.user!.id,
            phone,
            name,
            email,
            source: 'IMPORT'
          }
        });

        // Add tags
        for (const tagName of tags) {
          let tag = await prisma.tag.findFirst({
            where: { name: tagName }
          });

          if (!tag) {
            tag = await prisma.tag.create({
              data: { name: tagName }
            });
          }

          await prisma.contactTag.create({
            data: {
              contactId: contact.id,
              tagId: tag.id
            }
          });
        }

        results.imported++;
      } catch (error) {
        results.errors.push(`Failed to import ${contactData.phone}: ${error}`);
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import contacts' });
  }
});

export default router;