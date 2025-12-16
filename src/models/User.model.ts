import { Schema, model, Document, Types } from 'mongoose';

export enum IUserRole {
  User = 'user',
  Admin = 'admin'
}

export interface IUser extends Document {
  firebaseId: string;
  email: string;
  displayName: string;
  role: IUserRole[];
  DMCampaigns: Types.ObjectId[];
  playerCampaigns: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firebaseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    role: {
      type: [String],
      enum: Object.values(IUserRole),
      default: [IUserRole.User],
    },
    DMCampaigns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
      },
    ],
    playerCampaigns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);
