import { Request, Response } from 'express';
import CharacterService from '../services/Character.service';
import { createdCharacterData } from '../services/Character.service';
import { Campaign } from '../models';

export default class CharacterController {
    static async createCharacter(req: Request, res: Response) {
        const { campaignId } = req.params;
        const user = req.user;

        if (!campaignId || !user) {
            return res.status(400).json({ error: 'Campaign ID and user are required' });
        }

        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (!campaign.players.includes(user._id)) {
            return res.status(403).json({ error: 'User is not a player in this campaign' });
        }

        const data: createdCharacterData = {...req.body,
            campaign: campaign._id,
            owner: user._id
        };

        try {
            const character = await CharacterService.createCharacter(data);
            res.status(201).json(character);
        } catch (error) {
            console.error('Error creating character:', error);
            res.status(500).json({ error: 'Failed to create character' });
        }
    }

    static async getCharacterDetails(req: Request, res: Response) {
        const { characterId } = req.params;
        const user = req.user;

        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }        

        try {
            const character = await CharacterService.getCharacterDetails(characterId);

            
            if (!character) {
                return res.status(404).json({ error: 'Character not found' });
            }

            if (character.owner.toString() !== user._id.toString()) {
                return res.status(403).json({ error: 'Forbidden: You do not own this character' });
            }

            res.status(200).json(character);
        } catch (error) {
            console.error('Error fetching character details:', error);
            res.status(500).json({ error: 'Failed to fetch character details' });
        }
    }

    static async getCharactersByPlayer(req: Request, res: Response) {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ error: 'User is required' });
        }

        try {
            const characters = await CharacterService.getPlayerCharacters(user._id.toString());
            res.status(200).json(characters);
        } catch (error) {
            console.error('Error fetching player characters:', error);
            res.status(500).json({ error: 'Failed to fetch player characters' });
        }
    }

    static async updateCharacter(req: Request, res: Response) {
        const { characterId } = req.params;
        const updateData = req.body;
        const user = req.user;

        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        try {
            const character = await CharacterService.getCharacterDetails(characterId);
            if (!character) {
                return res.status(404).json({ error: 'Character not found' });
            }
            if (character.owner.toString() !== user._id.toString()) {
                return res.status(403).json({ error: 'Forbidden: You do not own this character' });
            }
            const updatedCharacter = await CharacterService.updateCharacter(characterId, updateData);
            res.status(200).json(updatedCharacter);
        } catch (error) {
            console.error('Error updating character:', error);
            res.status(500).json({ error: 'Failed to update character' });
        }
    }

    static async deleteCharacter(req: Request, res: Response) {
        const { characterId } = req.params;
        const user = req.user;

        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        try {
            const character = await CharacterService.getCharacterDetails(characterId);
            if (!character) {
                return res.status(404).json({ error: 'Character not found' });
            }
            if (character.owner.toString() !== user._id.toString()) {
                return res.status(403).json({ error: 'Forbidden: You do not own this character' });
            }

            await CharacterService.deleteCharacter(characterId);
            res.status(200).json({ message: 'Character deleted successfully' });
        } catch (error) {
            console.error('Error deleting character:', error);
            res.status(500).json({ error: 'Failed to delete character' });
        }
    }
}