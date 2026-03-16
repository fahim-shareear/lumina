import admin from 'firebase-admin';

const getAdminApp = () => {
  if (admin.apps.length > 0) return admin.apps[0];
  
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    // During build or if env vars are missing, we return null instead of throwing
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
