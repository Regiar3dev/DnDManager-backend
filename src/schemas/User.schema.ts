import joi from 'joi';

export const UserSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),
    displayName: joi.string().min(1).max(100).required().messages({
        'string.base': 'Display name must be a string',
        'string.min': 'Display name must be at least 1 character long',
        'string.max': 'Display name must be at most 100 characters long',
        'any.required': 'Display name is required',
    }),
    role: joi.array().items(joi.string()).optional().messages({
        'array.base': 'Role must be an array of strings',
        'array.items': 'Each role must be a string',
    }),
    DMCampaigns: joi.array().items(joi.string().hex().length(24)).optional().messages({
        'array.base': 'DMCampaigns must be an array',
        'array.items': 'DMCampaigns must be an array of hex strings',
        'string.hex': 'Each DMCampaign ID must be a valid hex string',
        'string.length': 'Each DMCampaign ID must be 24 characters long',
    }),
    playerCampaigns: joi.array().items(joi.string().hex().length(24)).optional().messages({
        'array.base': 'PlayerCampaigns must be an array',
        'array.items': 'PlayerCampaigns must be an array of hex strings',
        'string.hex': 'Each PlayerCampaign ID must be a valid hex string',
        'string.length': 'Each PlayerCampaign ID must be 24 characters long',
    }),
});
