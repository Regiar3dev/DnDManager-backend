import { User } from "../models/index"

export default class UserService {
    static async createMongoUser(data: { firebaseId: string; email: string; displayName: string; }) {
        console.log('Creating Mongo User with data:', data);

        return User.create({
            firebaseId: data.firebaseId,
            email: data.email,
            displayName: data.displayName,
            role: ['user'],
        });
    }

    static async getUserByUid(firebaseId: string) {
        return User.findOne({ firebaseId: firebaseId });
    }

    static async getUserCampaigns (firebaseId: string) {
        const campaigns = await User.findOne({ firebaseId: firebaseId })
            .populate('DMCampaigns')
            .populate('playerCampaigns');
        return campaigns;
    }
}