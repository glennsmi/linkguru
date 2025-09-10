import { onRequest, onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import * as QRCode from 'qrcode';

// Set global options for all functions
setGlobalOptions({
  region: 'us-central1',
  maxInstances: 10,
});

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// CORS configuration (unused for now)
// const corsHandler = cors({ origin: true });

// ============================================================================
// BASIC FUNCTIONS
// ============================================================================

// Hello World function
export const helloWorld = onRequest({ cors: true }, (req, res) => {
  res.json({ message: 'Hello from Firebase Functions!' });
});

// Get all users
export const getUsers = onRequest({ cors: true }, async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
});

// Create user
export const createUser = onCall(async (request) => {
  try {
    const { id, email, displayName } = request.data;
    
    if (!id || !email) {
      return { success: false, message: 'ID and email are required' };
    }
    
    const userRef = db.collection('users').doc(id);
    
    const userData = {
      id,
      email,
      displayName: displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await userRef.set(userData);
    
    return { success: true, data: { id } };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Failed to create user' };
  }
});

// Get current user
export const getCurrentUser = onCall(async (request) => {
  try {
    const { uid } = request.data;
    if (!uid) {
      return { success: false, message: 'User ID is required' };
    }
    
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return { success: false, message: 'User not found' };
    }
    
    const userData = {
      id: userDoc.id,
      ...userDoc.data(),
    };
    
    return { success: true, data: userData };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, message: 'Failed to get current user' };
  }
});

// Update user
export const updateUser = onCall(async (request) => {
  try {
    const { uid, ...updateData } = request.data;
    if (!uid) {
      return { success: false, message: 'User ID is required' };
    }

    const userRef = db.collection('users').doc(uid);
    const updatePayload = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.update(updatePayload);
    
    return { success: true, data: { id: uid } };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: 'Failed to update user' };
  }
});

// ============================================================================
// LINK GURU FUNCTIONS
// ============================================================================

// Create short link
export const createShortLink = onCall(async (request) => {
  try {
    console.log('🔗 createShortLink called with request.data:', request.data);
    console.log('👤 request.auth:', request.auth);
    
    const { url, customAlias, tenantId, utmSource, utmMedium, utmCampaign, utmTerm, utmContent } = request.data;
    
    console.log('📋 Extracted parameters:', {
      url,
      customAlias,
      tenantId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent
    });
    
    if (!url || !tenantId) {
      console.log('❌ Missing required parameters:', { url: !!url, tenantId: !!tenantId });
      return { success: false, message: 'URL and tenant ID are required' };
    }
    
    // Generate short ID
    const shortId = customAlias || generateShortId();
    console.log('🔑 Generated shortId:', shortId);
    
    // Check if short ID already exists
    console.log('🔍 Checking if shortId exists...');
    const existingLink = await db.collection('links')
      .where('shortId', '==', shortId)
      .limit(1)
      .get();

    if (!existingLink.empty) {
      console.log('❌ Short ID already exists:', shortId);
      return { success: false, message: 'Short ID already exists' };
    }

    console.log('✅ Short ID is unique, creating link document...');

    // Create link document
    const linkData = {
      shortId,
      originalUrl: url,
      tenantId,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      utmTerm: utmTerm || null,
      utmContent: utmContent || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: request.auth?.uid || null,
        isActive: true,
      clickCount: 0,
      lastClickedAt: null,
    };
    
    console.log('💾 Saving link to Firestore:', linkData);
    const linkRef = await db.collection('links').add(linkData);
    console.log('✅ Link saved with ID:', linkRef.id);
    
    const response = {
      id: linkRef.id,
      shortId,
      shortUrl: `https://linkguru.app/${shortId}`,
      originalUrl: url,
      tenantId,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      utmTerm: utmTerm || null,
      utmContent: utmContent || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: request.auth?.uid || null,
      isActive: true,
      clickCount: 0,
      lastClickedAt: null,
    };
    
    console.log('📤 Returning response:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('💥 Error creating short link:', error);
    return { success: false, message: 'Failed to create short link' };
  }
});

// Redirect function
export const redirect = onRequest({ cors: true }, async (req, res) => {
  try {
    // Extract shortId from URL path - Firebase Hosting sends /{shortId} to this function
    const urlPath = req.url || '';
    const shortId = urlPath.replace('/', '').split('?')[0]; // Remove leading / and any query params
    
    console.log('🔗 Redirect called with URL:', req.url, 'extracted shortId:', shortId);

      if (!shortId) {
      res.status(400).json({ error: 'Short ID is required' });
        return;
      }

    // Find the link
    const linkQuery = await db.collection('links')
        .where('shortId', '==', shortId)
      .where('isActive', '==', true)
        .limit(1)
        .get();

      if (linkQuery.empty) {
      res.status(404).json({ error: 'Link not found' });
        return;
      }

      const linkDoc = linkQuery.docs[0];
    const linkData = linkDoc.data();
    
    // Update click count
    await linkDoc.ref.update({
      clickCount: admin.firestore.FieldValue.increment(1),
      lastClickedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Record click analytics
    const clickData = {
      linkId: linkDoc.id,
      shortId,
      tenantId: linkData.tenantId,
      clickedAt: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: req.get('User-Agent') || '',
      ipAddress: req.ip || req.connection.remoteAddress || '',
      referer: req.get('Referer') || '',
      deviceType: getDeviceType(req.get('User-Agent') || ''),
    };
    
    await db.collection('clicks').add(clickData);
    
    // Redirect to original URL
    res.redirect(302, linkData.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create tenant
export const createTenant = onCall(async (request) => {
  try {
    const { name } = request.data;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return { success: false, message: 'Tenant name is required' };
    }
    
    if (!request.auth?.uid) {
      return { success: false, message: 'Authentication required' };
    }
    
    // Create tenant document
    const tenantData = {
      name: name.trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: request.auth.uid,
      isActive: true,
    };
    
    const tenantRef = await db.collection('tenants').add(tenantData);
    
    // Add user as tenant member with owner role
    const memberData = {
      userId: request.auth.uid,
      tenantId: tenantRef.id,
      role: 'owner',
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
    };
    
    await db.collection('members').add(memberData);
    
    return {
      success: true,
      data: {
        id: tenantRef.id,
        name: name.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: request.auth.uid,
        isActive: true,
      }
    };
    } catch (error) {
    console.error('Error creating tenant:', error);
    return { success: false, message: 'Failed to create tenant' };
  }
});

// Get user tenants
export const getUserTenants = onCall(async (request) => {
  try {
    if (!request.auth?.uid) {
      return { success: false, message: 'Authentication required' };
    }
    
    // Get user's tenant memberships
    const membershipsQuery = await db.collection('members')
      .where('userId', '==', request.auth.uid)
      .where('isActive', '==', true)
      .get();
    
    if (membershipsQuery.empty) {
      return { success: true, data: [] };
    }
    
    // Get tenant details
    const tenantIds = membershipsQuery.docs.map(doc => doc.data().tenantId);
    const tenantsQuery = await db.collection('tenants')
      .where(admin.firestore.FieldPath.documentId(), 'in', tenantIds)
      .where('isActive', '==', true)
      .get();
    
    const tenants = tenantsQuery.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
        createdBy: data.createdBy,
        isActive: data.isActive,
      };
    });
    
    return { success: true, data: tenants };
  } catch (error) {
    console.error('Error getting user tenants:', error);
    return { success: false, message: 'Failed to get user tenants' };
  }
});

// Get links for tenant
export const getLinks = onCall(async (request) => {
  try {
    console.log('🔍 getLinks called with request.data:', request.data);
    console.log('👤 request.auth:', request.auth);
    
    const { tenantId, page = 1, limit = 10 } = request.data;
    
    console.log('📋 Extracted parameters:', { tenantId, page, limit });
    
    if (!request.auth?.uid) {
      console.log('❌ Authentication required');
      return { success: false, message: 'Authentication required' };
    }
    
    if (!tenantId) {
      console.log('❌ Tenant ID is required');
      return { success: false, message: 'Tenant ID is required' };
    }
    
    console.log('🔍 Checking user membership for tenant...');
    // Verify user has access to tenant
    const membershipQuery = await db.collection('members')
      .where('userId', '==', request.auth.uid)
      .where('tenantId', '==', tenantId)
      .where('isActive', '==', true)
      .limit(1)
      .get();
    
    console.log('👥 Membership query result:', membershipQuery.empty ? 'No membership found' : 'Membership found');
    
    if (membershipQuery.empty) {
      console.log('❌ Access denied to tenant');
      return { success: false, message: 'Access denied to tenant' };
    }
    
    console.log('✅ User has access, querying links...');
    // Get links with pagination (temporarily no orderBy until index builds)
    const offset = (page - 1) * limit;
    const linksQuery = await db.collection('links')
      .where('tenantId', '==', tenantId)
      .offset(offset)
      .limit(limit)
      .get();
    
    console.log('📊 Links query result:', linksQuery.size, 'documents found');
    
    const links = linksQuery.docs
      .map(doc => {
        const data = doc.data();
        const link = {
          id: doc.id,
          tenantId: data.tenantId,
          shortId: data.shortId,
          longUrl: data.originalUrl, // Map to expected property name
          originalUrl: data.originalUrl,
          utm: {
            source: data.utmSource,
            medium: data.utmMedium,
            campaign: data.utmCampaign,
            term: data.utmTerm,
            content: data.utmContent,
          },
        metadata: {
          title: data.title || undefined,
          tags: data.tags || [],
          createdBy: data.createdBy,
          createdAt: (data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)).toISOString(),
          lastModified: (data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)).toISOString(),
          isActive: data.isActive,
          expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate().toISOString() : undefined,
        },
          qrConfig: data.qrConfig || null,
          stats: {
            totalClicks: data.clickCount || 0,
            lastClickAt: data.lastClickedAt?.toDate ? data.lastClickedAt.toDate().toISOString() : undefined,
          },
        };
        console.log('🔗 Processing link with proper structure:', link);
        return link;
      })
      .filter(link => link.metadata.isActive) // Filter active links client-side
      .sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()); // Sort by createdAt desc client-side
    
    const result = {
      success: true,
      data: {
        links,
        page,
        limit,
        total: links.length,
      }
    };
    
    console.log('📤 Returning getLinks result:', result);
    return result;
  } catch (error) {
    console.error('💥 Error getting links:', error);
    return { success: false, message: 'Failed to get links' };
  }
});

// Generate QR code
export const generateQR = onRequest({ cors: true }, async (req, res) => {
  try {
    const { shortId, format = 'svg' } = req.query;
    
    if (!shortId || typeof shortId !== 'string') {
      res.status(400).json({ error: 'Short ID is required' });
      return;
    }
    
    // Verify the link exists
    const linkQuery = await db.collection('links')
      .where('shortId', '==', shortId)
      .where('isActive', '==', true)
      .limit(1)
        .get();

    if (linkQuery.empty) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }
    
    const shortUrl = `https://linkguru.app/${shortId}`;
    
    if (format === 'svg') {
      const qrSvg = await QRCode.toString(shortUrl, { 
        type: 'svg' as const,
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(qrSvg);
    } else if (format === 'png') {
      const qrPng = await QRCode.toBuffer(shortUrl, { 
        type: 'png' as const,
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      res.setHeader('Content-Type', 'image/png');
      res.send(qrPng);
    } else {
      res.status(400).json({ error: 'Invalid format. Use svg or png' });
      return;
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Generate short ID
function generateShortId(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get device type from user agent
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}