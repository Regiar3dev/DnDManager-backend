import joi from 'joi';


export const statsCreateSchema = joi.object({
  hp: joi.number().greater(0).required().messages({
    'number.base': 'HP must be a number',
    'number.greater': 'HP must be greater than 0',
    'any.required': 'HP is required',
  }),
  maxHp: joi.number().greater(0).required().messages({
    'number.base': 'Max HP must be a number',
    'number.greater': 'Max HP must be greater than 0',
    'any.required': 'Max HP is required',
  }),
  strength: joi.number().greater(0).required().messages({
    'number.base': 'Strength must be a number',
    'number.greater': 'Strength must be greater than 0',
    'any.required': 'Strength is required',
  }),
  dexterity: joi.number().greater(0).required().messages({
    'number.base': 'Dexterity must be a number',
    'number.greater': 'Dexterity must be greater than 0',
    'any.required': 'Dexterity is required',
  }),
  constitution: joi.number().greater(0).required().messages({
    'number.base': 'Constitution must be a number',
    'number.greater': 'Constitution must be greater than 0',
    'any.required': 'Constitution is required',
  }),
  intelligence: joi.number().greater(0).required().messages({
    'number.base': 'Intelligence must be a number',
    'number.greater': 'Intelligence must be greater than 0',
    'any.required': 'Intelligence is required',
  }),
  wisdom: joi.number().greater(0).required().messages({
    'number.base': 'Wisdom must be a number',
    'number.greater': 'Wisdom must be greater than 0',
    'any.required': 'Wisdom is required',
  }),
  charisma: joi.number().greater(0).required().messages({
    'number.base': 'Charisma must be a number',
    'number.greater': 'Charisma must be greater than 0',
    'any.required': 'Charisma is required',
  }),
})

export const statsUpdateSchema = joi.object({   
  hp: joi.number().min(0).messages({
    'number.base': 'HP must be a number',
    'number.min': 'HP cannot be negative',
  }),
  maxHp: joi.number().min(0).required().messages({
    'number.base': 'Max HP must be a number',
    'number.min': 'Max HP cannot be negative',
    'any.required': 'Max HP is required',
  }),
  strength: joi.number().min(0).required().messages({
    'number.base': 'Strength must be a number',
    'number.min': 'Strength cannot be negative',
    'any.required': 'Strength is required',
  }),
  dexterity: joi.number().min(0).required().messages({
    'number.base': 'Dexterity must be a number',
    'number.min': 'Dexterity cannot be negative',
    'any.required': 'Dexterity is required',
  }),
  constitution: joi.number().min(0).required().messages({
    'number.base': 'Constitution must be a number',
    'number.min': 'Constitution cannot be negative',
    'any.required': 'Constitution is required',
  }),
  intelligence: joi.number().min(0).required().messages({
    'number.base': 'Intelligence must be a number',
    'number.min': 'Intelligence cannot be negative',
    'any.required': 'Intelligence is required',
  }),
  wisdom: joi.number().min(0).required().messages({
    'number.base': 'Wisdom must be a number',
    'number.min': 'Wisdom cannot be negative',
    'any.required': 'Wisdom is required',
  }),
  charisma: joi.number().min(0).required().messages({
    'number.base': 'Charisma must be a number',
    'number.min': 'Charisma cannot be negative',
    'any.required': 'Charisma is required',
  }),
})

export const CharacterCreateSchema = joi.object({
  campaign: joi.string().hex().length(24).required().messages({
    'string.hex': 'Campaign ID must be a valid hex string',
    'string.length': 'Campaign ID must be 24 characters long',
    'any.required': 'Campaign ID is required',
  }),
  owner: joi.string().hex().length(24).required().messages({
    'string.hex': 'Owner ID must be a valid hex string',
    'string.length': 'Owner ID must be 24 characters long',
    'any.required': 'Owner ID is required',
  }),
  name: joi.string().min(1).max(100).required().messages({
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name must be at most 100 characters long',
    'any.required': 'Name is required',
  }),
  class: joi.string().min(1).max(100).required().messages({
    'string.min': 'Class must be at least 1 character long',
    'string.max': 'Class must be at most 100 characters long',
    'any.required': 'Class is required',
  }),
  race: joi.string().min(1).max(100).required().messages({
    'string.min': 'Race must be at least 1 character long',
    'string.max': 'Race must be at most 100 characters long',
    'any.required': 'Race is required',
  }),
  level: joi.number().min(1).max(20).required().messages({
    'number.min': 'Level must be at least 1',
    'number.max': 'Level must be at most 20',
    'any.required': 'Level is required',
  }),
  xp: joi.number().min(0).required().messages({
    'number.min': 'XP cannot be negative',
    'any.required': 'XP is required',
  }),
  stats: statsCreateSchema.required().messages({
    'any.required': 'Stats are required',
  }),
  armorClass: joi.number().required().messages({
    'number.base': 'Armor Class must be a number',
    'any.required': 'Armor Class is required',
  }),
  skills: joi.object().pattern(joi.string(), joi.number()).optional().messages({
    'object.pattern': 'Skills must be an object with string keys and number values',
    'any.required': 'Skills are required',
  }),
  equipment: joi.array().items(joi.string()).optional().messages({
    'array.base': 'Equipment must be an array of strings',
    'array.items': 'Each equipment item must be a string',
  }),
  background: joi.string().allow('').optional().messages({
    'string.base': 'Background must be a string',
  }),
  notes: joi.string().allow('').optional().messages({
    'string.base': 'Notes must be a string',
  }),
});

export const CharacterUpdateSchema = joi.object({
  campaign: joi.string().hex().length(24).messages({
    'string.hex': 'Campaign ID must be a valid hex string',
    'string.length': 'Campaign ID must be 24 characters long',
  }),
  owner: joi.string().hex().length(24).messages({
    'string.hex': 'Owner ID must be a valid hex string',
    'string.length': 'Owner ID must be 24 characters long',
  }),
  name: joi.string().min(1).max(100).messages({
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name must be at most 100 characters long',
  }),
  class: joi.string().min(1).max(100).messages({
    'string.min': 'Class must be at least 1 character long',
    'string.max': 'Class must be at most 100 characters long',
  }),
  race: joi.string().min(1).max(100).messages({
    'string.min': 'Race must be at least 1 character long',
    'string.max': 'Race must be at most 100 characters long',
  }),
  level: joi.number().min(1).max(20).messages({
    'number.base': 'Level must be a number',
    'number.min': 'Level must be at least 1',
    'number.max': 'Level must be at most 20',
  }),
  xp: joi.number().min(0).messages({
    'number.min': 'XP cannot be negative',
  }),
  stats: statsUpdateSchema,
  armorClass: joi.number().required().messages({
    'number.base': 'Armor Class must be a number',
    'any.required': 'Armor Class is required',
  }),
  skills: joi.object().pattern(joi.string(), joi.number()).messages({
    'object.base': 'Skills must be an object',
    'object.pattern': 'Skills must be an object with string keys and number values',
  }),
  equipment: joi.array().items(joi.string()).messages({
    'array.base': 'Equipment must be an array of strings',
    'array.items': 'Each equipment item must be a string',
  }),
  background: joi.string().allow('').messages({
    'string.base': 'Background must be a string',
  }),
  notes: joi.string().allow('').optional().messages({
    'string.base': 'Notes must be a string',
  }),
});