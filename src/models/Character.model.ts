import { Schema, model, Document, Types } from 'mongoose';

export interface ICharacter extends Document {
  campaign: Types.ObjectId; // Reference to Campaign
  owner: Types.ObjectId; // Reference to User
  name: string;
  class: string;
  race: string;
  level: number;
  experience: number;
  hitPoints: number;
  armorClass: number;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: Record<string, number>;
  equipment: string[];
  background: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const characterSchema = new Schema<ICharacter>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    race: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 20,
    },
    experience: {
      type: Number,
      default: 0,
    },
    hitPoints: {
      type: Number,
      required: true,
    },
    armorClass: {
      type: Number,
      required: true,
    },
    attributes: {
      strength: { type: Number, required: true },
      dexterity: { type: Number, required: true },
      constitution: { type: Number, required: true },
      intelligence: { type: Number, required: true },
      wisdom: { type: Number, required: true },
      charisma: { type: Number, required: true },
    },
    skills: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    equipment: [String],
    background: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Character = model<ICharacter>('Character', characterSchema);
