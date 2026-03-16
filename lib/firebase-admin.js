import admin from 'firebase-admin';

const getAdminApp = () => {
  if (admin.apps.length > 0) return admin.apps[0];
  
  let projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Try to load from the local JSON file if env vars are missing
  if (!projectId || !clientEmail || !privateKey) {
    try {
      const fs = require('fs');
      const path = require('path');
      const keyPath = path.join(process.cwd(), 'firebase_sdk_admin_key.json');
      
      if (fs.existsSync(keyPath)) {
        const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        projectId = keyFile.project_id;
        clientEmail = keyFile.client_email;
        privateKey = keyFile.private_key;
      }
    } catch (err) {
      console.warn('Attempted to load firebase_sdk_admin_key.json but failed:', err.message);
    }
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin missing credentials. User creation will fail.', {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey
    });
    return null;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    return null;
  }
};

export const getAdminAuth = () => {
  const app = getAdminApp();
  return app ? admin.auth(app) : null;
};

export const getAdminDb = () => {
  const app = getAdminApp();
  return app ? admin.firestore(app) : null;
};
