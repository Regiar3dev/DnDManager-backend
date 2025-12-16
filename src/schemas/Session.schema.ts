import joi from 'joi';

export const SessionSchema = joi.object({
    title: joi.string().required().messages({
        'string.base': 'Title must be a string',
        'any.required': 'Title is required',
    }),
    description: joi.string().allow('').optional().messages({
        'string.base': 'Description must be a string',
    }),
    coverPhoto: joi.string().uri().allow('').optional().messages({
        'string.uri': 'Cover photo must be a valid URI',
    }),
    notesDM: joi.string().allow('').optional().messages({
        'string.base': 'DM notes must be a string',
    }),
    notesPlayers: joi.string().allow('').optional().messages({
        'string.base': 'Player notes must be a string',
    }),
    forDM: joi.boolean().optional().messages({
        'boolean.base': 'forDM must be a boolean',
        'any.required': 'forDM is required',
    }),
    events: joi.array().items(joi.string().hex().length(24)).optional().messages({
        'array.base': 'Events must be an array',
        'array.items': 'Events must be an array of hex strings',
    }),
    startDate: joi.date().optional().messages({
        'date.base': 'Start date must be a valid date',
    }),
    endDate: joi.date().optional().messages({
        'date.base': 'End date must be a valid date',
    }),
});

export const SessionNoteSchema = joi.object({
  note: joi.string().min(1).required().messages({
    'string.base': 'Note must be a string',
    'string.empty': 'Note cannot be empty',
    'any.required': 'Note is required',
  }),
  forDM: joi.boolean().required().messages({
    'boolean.base': 'forDM must be a boolean',
    'any.required': 'forDM is required',
  }),
}).unknown(false);