import Joi from "joi";

export default Joi.object({

    id: Joi.string().uuid(),
    createdAt: Joi.string().isoDate(),

    characterName: Joi
        .string()
        .min(3)
        .max(20)
        .required(),

    childAge: Joi
        .number()
        .integer()
        .min(4)
        .max(13)
        .required(),

    skinColor: Joi
        .string()
        .pattern(/^#[0-9A-F]{6}$/i)
        .required(),

    hairStyle: Joi
        .string()
        .valid('Classic Bob', 'Sleek Ponytail', 'Messy Bun', 'Side Swept Waves', 'Pixie Cut')
        .default('Classic Bob'),

    headShape: Joi
        .string()
        .valid('Oval', 'Round', 'Square', 'Heart-shaped', 'Diamond')
        .default('Oval'),

    upperClothing: Joi
        .string()
        .valid('Polo shirt', 'Button-down shirt', 'T-shirt', 'Tank top', 'Blouse', 'Dress')
        .default('Polo shirt'),

    lowerClothing: Joi
        .alternatives().conditional('upperClothing', {
            is: 'Dress',
            then: Joi.forbidden(),
            otherwise: Joi
                .string()
                .valid('Jeans', 'Leggings', 'Shorts', 'Skirt', 'Trousers')
                .default('Jeans')
        })
})