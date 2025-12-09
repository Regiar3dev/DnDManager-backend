import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
    session: Types.ObjectId; // Sesión a la que pertenece el evento
    type: "damage" | "healing" | "xp" | "loot" | "custom"; // Tipo de evento
    character: Types.ObjectId[]; // Personaje afectado por el evento
    value: number;
    payload: object; // Si es un evento de Loot o Custom, aca va el detalle
    createdAt: Date;
}

const eventSchema = new Schema<IEvent>({
    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
    },
    type: {
        type: String,
        enum: ["damage", "healing", "xp", "loot", "custom"],
        required: true,
    },
    character: [{
        type: Schema.Types.ObjectId,
        ref: 'Character',
        required: true,
    }],
    value: {
        type: Number
    },
    payload: {
        type: Schema.Types.Mixed,
        default: {},
    },
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

export const Event = model<IEvent>('Event', eventSchema);