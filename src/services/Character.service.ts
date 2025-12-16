import { Types } from 'mongoose';
import { Character } from '../models/Character.model';
import { Campaign } from '../models';

export interface createdCharacterData {
    campaign: Types.ObjectId;
    owner: Types.ObjectId;
    name: string;
    class: string;
    race: string;
    level: number;
    xp: number;
    stats: {
        hp: number;
        maxHp: number;
        ac: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    armorClass: number;
    skills?: Record<string, number>;
    equipment?: string[];
    background?: string;
    notes?: string;
}

export default class CharacterService {
    static async createCharacter(data: createdCharacterData) {
        const character = await Character.create({
            ...data
        });

        const campaign = await Campaign.findById(data.campaign);

        campaign?.characters.push(character._id);
        await campaign?.save();

        return character;
    }

    static async getCharacterDetails(characterId: string) {
        return Character.findById(characterId);
    }

    static async getPlayerCharacters(userId: string) {
        return Character.find({ owner: userId });
    }

    static async updateCharacter(characterId: string, data: Partial<createdCharacterData>) {
        return Character.findByIdAndUpdate(characterId, data, { new: true });
    }

    static async deleteCharacter(characterId: string) {
        const character = await Character.findByIdAndDelete(characterId);
        
        await Campaign.updateMany({
            characters: characterId
        }, {
            $pull: { characters: characterId }
        });
        
        return character;
    }
}