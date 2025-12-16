import joi from 'joi';

export const CampaignCreateSchema = joi.object({
  name: joi.string().min(1).max(100).required().messages({
    'string.base': 'Campaign name must be a string',
    'string.empty': 'Campaign name is required',
    'any.required': 'Campaign name is required',
  }),
  description: joi.string().allow('').optional(),
});

export const CampaignUpdateSchema = joi.object({
  name: joi.string().min(1).max(100).optional(),
  description: joi.string().allow('').optional(),
});