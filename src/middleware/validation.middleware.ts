<<<<<<< HEAD
// Middleware para validar inputs y datos en las solicitudes
=======
// Middleware para validar inputs y datos en las solicitudes
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

const validationMiddleware = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                 message: 'Validation Error',
                 details: error.details.map((d) => d.message) });
        }
        next();
    };
};

export default validationMiddleware;
>>>>>>> 35de856 (Validacion)
