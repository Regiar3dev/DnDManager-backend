import { Session } from '../models/Session.model';

export default class SessionService {
    static async createSession(data: { campaignId: string; title: string; description?: string; startDate?: Date; }) {
        return Session.create({
            campaign: data.campaignId,
            title: data.title,
            description: data.description || '',
            startDate: data.startDate || new Date(),
        });
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
        return Session.findById(sessionId);
    }

    static async startSession(sessionId: string, startDate: Date) {
        return Session.findByIdAndUpdate(
            sessionId,
            { startDate: startDate },
            { new: true }
        );
    }

    static async pauseSession(sessionId: string) { // Falta booleano indicando estado de la sesion
        return Session.findByIdAndUpdate(
            sessionId,
            { endDate: new Date() },
            { new: true }
        );
    }

    static async endSession(sessionId: string, endDate: Date) {
        return Session.findByIdAndUpdate(
            sessionId,
            { endDate: endDate },
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