import Joi from "joi";

export const validateBody = (schema) => (req, res, next) => {
 const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

// Example schemas
export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const customerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  company: Joi.string().optional()
});

export const leadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
 status: Joi.string().valid("New", "Contacted", "Converted", "Lost").optional(),
  value: Joi.number().optional()
});
export const updateLeadSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow("").max(500),
  status: Joi.string().valid("New", "Contacted", "Converted", "Lost"),
  value: Joi.number().min(0),
});
