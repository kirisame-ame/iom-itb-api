const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../schemas/responses/BaseError');

const optionalString = Joi.string().trim().allow('', null);

const fields = {
  name: Joi.string().trim().min(1).messages({
    'any.required': 'Nama instansi (Mitra) wajib diisi',
    'string.empty': 'Nama instansi (Mitra) wajib diisi',
    'string.min': 'Nama instansi (Mitra) wajib diisi',
  }),
  picName: optionalString,
  picPhone: optionalString,
  description: optionalString,
  image: optionalString,
  mou: optionalString,
};

const createSchema = Joi.object({
  ...fields,
  name: fields.name.required(),
  picName: fields.picName.default(null),
  picPhone: fields.picPhone.default(null),
  description: fields.description.default(null),
  image: fields.image.default(null),
  mou: fields.mou.default(null),
});

const updateSchema = Joi.object(fields).min(1).messages({
  'object.min': 'Minimal satu field kemitraan harus dikirim',
});

const validate = (schema, body) => {
  const { error, value } = schema.validate(body, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });

  if (error) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: error.details.map((detail) => detail.message).join(', '),
    });
  }

  return value;
};

class KemitraanDto {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  toPersistence() {
    return { ...this };
  }
}

class CreateKemitraanDto extends KemitraanDto {
  static from(body = {}) {
    return new CreateKemitraanDto(validate(createSchema, body));
  }
}

class UpdateKemitraanDto extends KemitraanDto {
  static from(body = {}) {
    return new UpdateKemitraanDto(validate(updateSchema, body));
  }
}

module.exports = {
  CreateKemitraanDto,
  UpdateKemitraanDto,
};
