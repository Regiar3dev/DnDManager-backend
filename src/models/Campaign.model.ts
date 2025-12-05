import { Schema, model, Document, Types } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  description: string;
  gamemaster: Types.ObjectId; // Reference to User
  players: Types.ObjectId[]; // Array of User references
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    gamemaster: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Campaign = model<ICampaign>('Campaign', campaignSchema);
