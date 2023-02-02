import joi from "joi";

export const pollSchema = joi.object({
  title: joi.string().min(10).required(),
  expireAt: joi.string().required(),
});