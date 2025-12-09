import admin from 'firebase-admin';
import serviceAccount from './dndauth-66d0b-firebase-adminsdk-fbsvc-af2e2e54ef.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
