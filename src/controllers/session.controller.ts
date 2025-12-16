import { Request, Response } from 'express';
import { Campaign, Session } from '../models';
import SessionService, { createSessionData } from '../services/Session.service';
import UserService from '../services/User.service';
import { populate } from 'dotenv';
import { Types } from 'mongoose';

export default class SessionController{ 
    static async createSession(req: Request, res: Response) {
        const { campaignId } = req.params;
        const data: createSessionData = {...req.body, campaign: campaignId};
        // const user = req.user;
        // const userId = user._id;

        try{
            if (!campaignId || !data.title) {
                return res.status(400).json({ error: 'Campaign ID and title are required' });
            }

            const session = await SessionService.createSession({
                ...data,
                campaign: campaignId
            });

            if (!session) {
                return res.status(500).json({ error: 'Failed to create session' });
            }

            res.status(201).json(session);

        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({ error: 'Error creating session' });
        }
    }
    
    static async getSessions(req: Request, res: Response) {
        const { campaignId } = req.params;

        try {
            
            if (!campaignId) {
                return res.status(400).json({ error: 'Campaign ID is required' });
            }

            const sessions = await Session.find({ campaign: campaignId });

            if (!sessions || sessions.length === 0) {
                return res.status(404).json({ error: 'No sessions found for this campaign' });
            }

            await Promise.all(sessions.map(session => session.populate('participants')));

            res.status(200).json(sessions);

        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ error: 'Error fetching sessions' });
        }
    }

    static async getSessionById(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.params;
        const user = req.user;
        const userId = user?._id.toString();
        
        if (!sessionId) {
            res.status(400).json({ error: 'Session ID is required' });
            return;
        }

        try {

            const session = await SessionService.getSessionById(sessionId);
            
            if (!session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }
            
            const campaign = await Campaign.findById(session.campaign);
            const isDM = campaign?.DM.toString() === userId;
            await session.populate('participants');

            if (isDM) {
                res.status(200).json(session);
                return;
            }

            const participantRole = session.participants.some(participantId => participantId.toString() === userId) ? 'Participant' : null;

            if (!participantRole || participantRole === null) {
                res.status(403).json({ error: 'Forbidden: Not a participant of the session' });
                return;
            }

            if (participantRole === 'Participant') {
                const { notesDM, ...sessionData } = session.toObject();
                res.status(200).json(sessionData);
                return;
            }
            else res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching session' });
            console.error('Error fetching session:', error);
        }
    }
    
    static async joinSession(req: Request, res: Response) {
        const { sessionId } = req.params;
        const user = req.user;

        const userId = user?._id.toString();

        try {
            
            if (!sessionId || !userId) {
                return res.status(400).json({ error: 'Session ID and User ID are required' });
            }

            const session = await SessionService.joinSession(sessionId, userId);

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            const { notesDM, ...sessionData } = session.toObject();
            res.status(200).json(sessionData);

        } catch (error) {
            console.error('Error joining session:', error);
            res.status(500).json({ error: 'Error joining session' });
        }
    }
    
    static async leaveSession(req: Request, res: Response) {
        const { sessionId } = req.params;
        const user = req.user;

        const userId = user?._id.toString();
        try {
            
            if (!sessionId || !userId) {
                return res.status(400).json({ error: 'Session ID and User ID are required' });
            }

            const session = await SessionService.leaveSession(sessionId, userId);

            if (!session) {
               return res.status(404).json({ error: 'Session not found' });
            }

            const { notesDM, ...sessionData } = session.toObject();

            res.status(200).json(sessionData);

        } catch (error) {
            console.error('Error leaving session:', error);
            res.status(500).json({ error: 'Error leaving session' });
        }
    }
    
    static async startSession(req: Request, res: Response) {
        const { sessionId } = req.params;

        try {
            if (!sessionId) {
                return res.status(400).json({ error: 'Session ID is required' });
            }

            const session = await SessionService.startSession(sessionId);

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            res.status(200).json(session);

        } catch (error) {
            console.error('Error starting session:', error);
            res.status(500).json({ error: 'Error starting session' });
        }

    }

    static async pauseSession(req: Request, res: Response) {
        const { sessionId } = req.params;

        try {
            if (!sessionId) {
                return res.status(400).json({ error: 'Session ID is required' });
            }

            const session = await SessionService.pauseSession(sessionId);

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            res.status(200).json(session);

        } catch (error) {
            console.error('Error pausing session:', error);
            res.status(500).json({ error: 'Error pausing session' });
        }
    }

    static async endSession(req: Request, res: Response) {
        const { sessionId } = req.params;

        try {
            if (!sessionId) {
                return res.status(400).json({ error: 'Session ID is required' });
            }

            const session = await SessionService.endSession(sessionId);

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            res.status(200).json(session);

        } catch (error) {
            console.error('Error ending session:', error);
            res.status(500).json({ error: 'Error ending session' });
        }
    }

    static async addNoteToSession(req: Request, res: Response) {
        const { sessionId } = req.params;
        const { note, forDM } = req.body;

        try {
            if (!sessionId) {
                return res.status(400).json({ error: 'Session ID is required' });
            }

            const session = await SessionService.addNoteToSession(sessionId, note, forDM);

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            res.status(200).json(session);
        } catch (error) {
            console.error('Error adding note to session:', error);
            res.status(500).json({ error: 'Error adding note to session' });
        }

    }

}