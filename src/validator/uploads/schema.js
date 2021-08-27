const Joi = require('joi')

const ImageHeadersSchema = Joi.object({
    'content-type': Joi.string().valid().required('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp')
}).unknown()

module.exports = { ImageHeadersSchema }
