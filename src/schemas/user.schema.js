import Joi from "joi";

export default Joi.object({
    name: Joi
        .string()
        .min(3)
        .max(20)
        .required(),

    username: Joi
        .string()
        .min(3)
        .max(20)
        .required(),

    password: Joi
        .string()
        .min(3)
        .max(128)
        .required(),

    roles: Joi.array().required()
})