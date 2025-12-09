import { Schema, model, Document, Types } from 'mongoose';

export interface ISession extends Document {
  campaign: Types.ObjectId; // Campaña a la que pertenece la sesión
  sessionNumber: number; // Número de la sesión dentro de la campaña
  title: string;
  description: string;
  coverPhoto: string;
  startDate: Date;
  endDate: Date;
  notesDM: string;
  notesPlayers: string;
  participants: Types.ObjectId[]; // Usuarios que participaron en la sesión
  events: Types.ObjectId[]; // Eventos ocurridos durante la sesión
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    sessionNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverPhoto: {
      type: String,
      default: '',
    },
    notesDM: {
      type: String,
      default: '',
    },
    notesPlayers: {
      type: String,
      default: '',
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    events: [{
      type: Schema.Types.ObjectId,
      ref: 'Event',
      default: [],
    }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Session = model<ISession>('Session', sessionSchema);
