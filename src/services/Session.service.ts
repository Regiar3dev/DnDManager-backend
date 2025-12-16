import { Campaign } from '../models';
import { Session } from '../models/Session.model';

export interface createSessionData {
    campaign: string;
    sessionNumber?: number;
    title: string;
    description?: string;
    startDate?: Date;
    coverPhoto?: string;
    notesDM?: string;
    notesPlayers?: string;
    participants?: string[];
    events?: string[];
    endDate?: Date;
}

export default class SessionService {
    static async createSession(data: createSessionData) {

        const ExistingCampaign = await Campaign.findById(data.campaign);
        if (!ExistingCampaign) {
            throw new Error('Campaign not found');
        }
        
        const lastSession = await Session.findOne({ campaign: data.campaign })
            .sort({ sessionNumber: -1 })
            .select('sessionNumber');

        const nextSessionNumber = lastSession ? lastSession.sessionNumber + 1 : 1;

        const session = new Session({
            ...data,
            campaign: ExistingCampaign._id,
            sessionNumber: nextSessionNumber,
        });

        await session.save();

        await Campaign.findByIdAndUpdate(data.campaign, {
            $push: { sessions: session._id }
        });

        return session;
    }

    static async getSessionsByCampaign(campaignId: string) {
        return Session.find({ campaign: campaignId });
    }

    static async joinSession(sessionId: string, userId: string) {
        return Session.findByIdAndUpdate(
            sessionId,
            { $addToSet: { participants: userId } },
            { new: true }
        );
    }

    static async leaveSession(sessionId: string, userId: string) {
        return Session.findByIdAndUpdate(
            sessionId,
            { $pull: { participants: userId } },
            { new: true }
        );
    }

    static async getSessionById(sessionId: string) {
        const session = await Session.findById(sessionId);
        return session;
    }

    static async startSession(sessionId: string) {
        return Session.findByIdAndUpdate(
            sessionId,
            { status: 'ongoing', startDate: new Date(Date.now()) },
            { new: true }
        );
    }

    static async pauseSession(sessionId: string) { // Falta booleano indicando estado de la sesion
        return Session.findByIdAndUpdate(
            sessionId,
            { status: 'paused', endDate: new Date(Date.now()) },
            { new: true }
        );
    }

    static async endSession(sessionId: string) {
        return Session.findByIdAndUpdate(
            sessionId,
            { status: 'completed', endDate: new Date(Date.now()) },
            { new: true }
        );
    }

    static async addNoteToSession(sessionId: string, note: string, forDM: boolean) {
        const updateField = forDM ? 'notesDM' : 'notesPlayers';
        return Session.findByIdAndUpdate(
            sessionId,
            { [updateField]: note },
            { new: true }
        );
    }

}