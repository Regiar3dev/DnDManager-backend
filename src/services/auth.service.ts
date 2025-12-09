import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import admin from '../config/firebase.config';
import UserService from './User.service';

export default class AuthService {
    static async registerUser(email: string, password: string, displayName: string) {
        let mongoUser;

        const fbUserData = await admin.auth().createUser({
            email,
            password,
            displayName,
        })
        .then(async userRecord => {
            mongoUser = await UserService.createMongoUser({
                firebaseId: userRecord.uid,
                email: userRecord.email!,
                displayName: userRecord.displayName || 'No Name',
            });
        })
        .catch(error => {
            throw new Error(`Error creating user: ${error.message}`);
        });

        return mongoUser;
    }

    static async login(firebaseId: string) {

        let user = await UserService.getUserByUid(firebaseId);

        if (!user) {
            const fbUser = await admin.auth().getUser(firebaseId);
            console.log('Firebase User:', fbUser);

            user = await UserService.createMongoUser({
                firebaseId: fbUser.uid,
                email: fbUser.email!,
                displayName: fbUser.displayName || 'No Name',
            });
        }

        return user;
    }
}