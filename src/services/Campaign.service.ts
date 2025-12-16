import { Session } from '../models';
import { Campaign } from '../models/Campaign.model';
import { User } from '../models/User.model';

export default class CampaignService {

    static async inviteCodeGenerator(): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let inviteCode = '';

        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            inviteCode += characters[randomIndex];
        }

        const isUnique = await this.checkInviteCodeUnique(inviteCode);

        if (isUnique) {
            return inviteCode;
        }
        else {
            return this.inviteCodeGenerator();
        }
    }

    static async checkInviteCodeUnique(inviteCode: string): Promise<boolean> {
        return Campaign.findOne({ inviteCode: inviteCode }).then(campaign => !campaign);
    }

    static async createCampaign(data: { name: string; description?: string; DM: string; inviteCode?: string; }) {
        const campaign = await Campaign.create({
            name: data.name,
            description: data.description || '',
            DM: data.DM,
            players: [],
            characters: [],
            sessions: [],
            inviteCode: await this.inviteCodeGenerator(),
        });

        // Add campaign to user's DMCampaigns
        await User.findByIdAndUpdate(data.DM, {
            $push: { DMCampaigns: campaign._id }
        });

        return campaign;
    }

    static async syncCampaignsForUser(userId: string) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const DMCampaigns = await Campaign.find({ DM: userId }).select('_id');
        const playerCampaigns = await Campaign.find({ players: userId }).select('_id');

        user.DMCampaigns = DMCampaigns.map(c => c._id);
        user.playerCampaigns = playerCampaigns.map(c => c._id);
        await user.save();
    }

    static async getCampaignsByUserId(userId: string) {
        
        const DMCampaigns = await Campaign.find({ DM: userId });
        const playerCampaigns = await Campaign.find({ players: userId });
        
        return { DMCampaigns, playerCampaigns };
    }

    static async userJoinCampaign(userId: string, inviteCode: string) {
        const campaign = await Campaign.findOne({ inviteCode: inviteCode });

        if (!campaign) {
            throw new Error('Invalid invite code');
        }

        if (campaign.players.some(playerId => playerId.toString() === userId) || campaign.DM.toString() === userId) {
            throw new Error('User already in campaign');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        campaign.players.push(user._id);
        
        await campaign.save();

        user.playerCampaigns.push(campaign._id);
        await user.save();

        return campaign;
    }

    static async leaveCampaign(userId: string, campaignId: string) {
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        if (!campaign.players.some(playerId => playerId.toString() === userId)) {
            throw new Error('User is not a player in this campaign');
        }

        campaign.players = campaign.players.filter(playerId => playerId.toString() !== userId);
        await campaign.save();

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.playerCampaigns = user.playerCampaigns.filter(campaignId => campaignId.toString() !== campaign._id.toString());
        await user.save();

        return campaign;
    }

    static async getCampaignById(campaignId: string) {
        return Campaign.findById(campaignId);
    }

    static async updateCampaign(campaignId: string, updateData: any) {
        const campaign = await Campaign.findByIdAndUpdate(campaignId, updateData, { new: true });

        if (!campaign) {
            throw new Error('Campaign not found');
        }
        return campaign;
    }

    static async deleteCampaign(campaignId: string) {
        const campaign = await Campaign.findByIdAndDelete(campaignId);

        if (!campaign) {
            throw new Error('Campaign not found');
        }
        return campaign;
    }

    static async getCampaignSessions(campaignId: string) {
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        const sessions = await Session.find({ campaign: campaignId });
        return sessions;
    }

    static async getCampaignCharacters(campaignId: string) {
        const campaign = await Campaign.findById(campaignId).populate('characters');

        if (!campaign) {
            throw new Error('Campaign not found');
        }
        return campaign.characters;
    }

    // static async getCampaignEnemies(campaignId: string) {
    //     const campaign = await Campaign.findById(campaignId).populate('enemies');
    //     if (!campaign) {
    //         throw new Error('Campaign not found');
    //     }
    //     return campaign.enemies;
    // }

}