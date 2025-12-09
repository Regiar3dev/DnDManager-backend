import {Request, Response} from 'express';
import CampaignService from '../services/Campaign.service';
import UserService from '../services/User.service';

export default class CampaignController {

    static async createCampaign(req: Request, res: Response) {
        const { name, description } = req.body;
        const firebaseId = req.body.user.uid;

        if (!name || !firebaseId) {
            return res.status(400).json({ error: 'Name and DM ID are required' });
        }

        try {
            // Get MongoDB user from Firebase UID
            const user = await UserService.getUserByUid(firebaseId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const campaign = await CampaignService.createCampaign({
                name,
                description,
                DM: user._id.toString(),
            });
            res.status(201).json(campaign);
        } catch (error) {
            console.error('Error creating campaign:', error);
            res.status(500).json({ error: 'Failed to create campaign' });
        }
    }

    static async getCampaigns(req: Request, res: Response) {
        const firebaseId = req.body.user.uid;

        try {
            // Get MongoDB user from Firebase UID
            const user = await UserService.getUserByUid(firebaseId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const campaigns = await CampaignService.getCampaignsByUserId(user._id.toString());
            res.status(200).json(campaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            res.status(500).json({ error: 'Failed to fetch campaigns' });
        }
    }

    static async syncCampaigns(req: Request, res: Response) {
        const firebaseId = req.body.user.uid;
        try {
            // Get MongoDB user from Firebase UID
            const user = await UserService.getUserByUid(firebaseId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await CampaignService.syncCampaignsForUser(user._id.toString());
            res.status(200).json({ message: 'Campaigns synced successfully' });
        } catch (error) {
            console.error('Error syncing campaigns:', error);
            res.status(500).json({ error: 'Failed to sync campaigns' });
        }
    }

    static async joinCampaign(req: Request, res: Response) {
        const firebaseId = req.body.user.uid;
        const { inviteCode } = req.body;
        if (!inviteCode) {
            return res.status(400).json({ error: 'Invite code is required' });
        }
        try {
            // Get MongoDB user from Firebase UID
            const user = await UserService.getUserByUid(firebaseId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const campaign = await CampaignService.userJoinCampaign(user._id.toString(), inviteCode);
            res.status(200).json(campaign);
        } catch (error) {
            console.error('Error joining campaign:', error);
            res.status(500).json({ error: (error as Error).message });
        }
    }

    static async leaveCampaign(req: Request, res: Response) {
        const firebaseId = req.body.user.uid;
        const { campaignId } = req.params;

        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        try {
            const user = await UserService.getUserByUid(firebaseId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const campaign = await CampaignService.leaveCampaign(user._id.toString(), campaignId);
            res.status(200).json(campaign);
        } catch (error) {
            console.error('Error leaving campaign:', error);
            res.status(500).json({ error: (error as Error).message });
        }
    }
}