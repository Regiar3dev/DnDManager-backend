import { Request, Response } from "express";
import AuthService from "../services/auth.service";

export default class AuthController {
    static async register(req: Request, res: Response) {
        const { email, password, displayName } = req.body;
        try {
            const user = await AuthService.registerUser(email, password, displayName);
            res.status(201).json(user);
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async login(req: Request, res: Response) {
        const firebaseId = req.auth.uid;

        const user = await AuthService.login(firebaseId);
        res.status(200).json(user);
    }
}