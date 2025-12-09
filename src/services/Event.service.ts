import { Event } from '../models/Event.model';

export default class EventService {

    static async createEvent(data: { sessionId: string;}) {
        return Event.create({
            session: data.sessionId,
        });
    }

    static async getEventsBySession(sessionId: string) {
        return Event.find({ session: sessionId });
    }

}