// Middleware para validar el rol de un usuario en una campaña

import { Request, Response, NextFunction } from 'express';
import { Campaign } from '../models/Campaign.model';
import { Session } from '../models/Session.model';
import UserService from '../services/User.service';

export const requireCampaignRole = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    
const userUid: string = req.body.user.uid;

    const user = await UserService.getUserByUid(userUid);
    const userId = user?._id.toString();

    let { campaignId } = req.params;
    const { sessionId } = req.params;

    try {
        if (!campaignId && sessionId) { // Obtener campaignId desde sessionId si no se proporciona (para endpoints de sesión)
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            campaignId = session.campaign.toString();
        }
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        
       const userRole = campaign.DM.toString() === (userId)
       ? 'DM' : campaign.players.some(playerId => playerId.toString() === userId)
       ? 'Player' : null;

        if (!userRole) {
            return res.status(403).json({ error: 'Forbidden: Not a member of the campaign' });
        }

        if (userRole !== role) {
            return res.status(403).json({ error: 'Forbidden: Insufficient role' });
        }

        next();

    } catch (error) {
        console.error('Error checking campaign role:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}