import { Schema, model, Document, Types } from 'mongoose';

export interface IEnemy extends Document {
  campaign: Types.ObjectId; // Reference to Campaign
  name: string;
  type: string;
  challengeRating: number;
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
  abilities: string[];
  resistances: string[];
  immunities: string[];
  actions: string[];
  loot: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const enemySchema = new Schema<IEnemy>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    challengeRating: {
      type: Number,
      required: true,
      min: 0,
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
    abilities: [String],
    resistances: [String],
    immunities: [String],
    actions: [String],
    loot: [String],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Enemy = model<IEnemy>('Enemy', enemySchema);
