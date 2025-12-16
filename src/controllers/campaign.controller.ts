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

    static async getCampaignDetails(req: Request, res: Response) {
        const { campaignId } = req.params;
        const firebaseId = req.body.user.uid;

        const user = await UserService.getUserByUid(firebaseId);
        const userId = user?._id.toString();

        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        try {
            const campaign = await CampaignService.getCampaignById(campaignId);
            if (!campaign) {
                return res.status(404).json({ error: 'Campaign not found' });
            }

            if (campaign.players.some(playerId => playerId.toString() === userId) === false &&
                campaign.DM.toString() !== userId) {
                return res.status(403).json({ error: 'Forbidden: Not a member of the campaign' });
            }

            const userRole = campaign.DM.toString() === (userId)
            ? 'DM' : campaign.players.some(playerId => playerId.toString() === userId)
            ? 'Player' : null;

            console.log('User Role in Campaign:', userRole);

            if (userRole === 'Player') {
                const { name, description, DM, players, characters, sessions } = campaign;
                return res.status(200).json({ name, description, DM, players, characters, sessions });
            }
            else res.status(200).json(campaign);
        } catch (error) {
            console.error('Error fetching campaign details:', error);
            res.status(500).json({ error: 'Failed to fetch campaign details' });
        }
    }
    
    static async updateCampaign(req: Request, res: Response) {
        const { campaignId } = req.params;
        const updateData = req.body;

        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }
        
        try {
            const campaign = await CampaignService.updateCampaign(campaignId, updateData);
            res.status(200).json(campaign);
        } catch (error) {
            console.error('Error updating campaign:', error);
            res.status(500).json({ error: 'Failed to update campaign' });
        }
    }

    static async deleteCampaign(req: Request, res: Response) {
        const { campaignId } = req.params;
        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }
        try {
            const campaign = await CampaignService.deleteCampaign(campaignId);
            res.status(200).json(campaign);
        } catch (error) {
            console.error('Error deleting campaign:', error);
            res.status(500).json({ error: 'Failed to delete campaign' });
        }
    }

    static async getCampaignSessions(req: Request, res: Response) {
        const { campaignId } = req.params;
        const firebaseId = req.body.user.uid;
        
        const user = await UserService.getUserByUid(firebaseId);
        const userId = user?._id.toString();

        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        try{
            const sessions = await CampaignService.getCampaignSessions(campaignId);
            const campaign = await CampaignService.getCampaignById(campaignId);
            
            if (!sessions) {
                return res.status(404).json({ error: 'No sessions found for this campaign' });
            }
            const isDM = campaign?.DM.toString() === userId;

            if (isDM) {
                res.status(200).json(sessions);
                return;
            }

            if (campaign?.players.some(playerId => playerId.toString() === userId)) {
                
                const filteredSessions = await sessions.map(session => {
                    const { notesDM, ...sessionData } = session.toObject();
                    return sessionData;
                });
                res.status(200).json(filteredSessions);
                return;
            } 

            return res.status(403).json({ error: 'Forbidden: Not a member of the campaign' });
        } catch (error) {
            console.error('Error fetching campaign sessions:', error);
            res.status(500).json({ error: 'Failed to fetch campaign sessions' });
        }
    }

    static async getCampaignCharacters(req: Request, res: Response) {
        const { campaignId } = req.params;
        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        try{
            const characters = await CampaignService.getCampaignCharacters(campaignId);
            
            if (!characters || characters.length === 0) {
                return res.status(404).json({ error: 'No characters found for this campaign' });
            }
            
            res.status(200).json(characters);
        } catch (error) {
            console.error('Error fetching campaign characters:', error);
            res.status(500).json({ error: 'Failed to fetch campaign characters' });
        }
    }

    // static async getCampaignEnemies(req: Request, res: Response) {
    //     const { campaignId } = req.params;
    //     if (!campaignId) {
    //         return res.status(400).json({ error: 'Campaign ID is required' });
    //     }

    //     try{
    //         const enemies = await CampaignService.getCampaignEnemies(campaignId);
    //         
    //         if (!enemies || enemies.length === 0) {
    //             return res.status(404).json({ error: 'No enemies found for this campaign' });
    //         }    
    // 
    //         res.status(200).json(enemies);
    //     } catch (error) {
    //         console.error('Error fetching campaign enemies:', error);
    //         res.status(500).json({ error: 'Failed to fetch campaign enemies' });
    //     }
    // }
}