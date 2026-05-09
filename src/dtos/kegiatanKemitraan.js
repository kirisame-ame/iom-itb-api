const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../schemas/responses/BaseError');

const STATUSES = ['planned', 'ongoing', 'completed', 'cancelled'];

const optionalString = Joi.string().trim().allow(null).empty('');
const optionalDate = Joi.date().allow(null).empty('');

const fields = {
  kemitraanId: Joi.number().integer().positive().messages({
    'any.required': 'Mitra wajib dipilih',
    'number.base': 'Mitra wajib dipilih dari daftar yang tersedia',
    'number.integer': 'Mitra wajib dipilih dari daftar yang tersedia',
    'number.positive': 'Mitra wajib dipilih dari daftar yang tersedia',
  }),
  name: Joi.string().trim().min(1).messages({
    'any.required': 'Nama kegiatan wajib diisi',
    'string.empty': 'Nama kegiatan wajib diisi',
    'string.min': 'Nama kegiatan wajib diisi',
  }),
  description: optionalString,
  location: optionalString,
  startDate: optionalDate,
  endDate: optionalDate,
  status: Joi.string().valid(...STATUSES).messages({
    'any.only': `Status harus salah satu dari: ${STATUSES.join(', ')}`,
  }),
  image: optionalString,
};

const createSchema = Joi.object({
  ...fields,
  kemitraanId: fields.kemitraanId.required(),
  name: fields.name.required(),
  description: fields.description.default(null),
  location: fields.location.default(null),
  startDate: fields.startDate.default(null),
  endDate: fields.endDate.default(null),
  status: fields.status.default('planned'),
  image: fields.image.default(null),
});

const updateSchema = Joi.object(fields).min(1).messages({
  'object.min': 'Minimal satu field kegiatan kemitraan harus dikirim',
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

class KegiatanKemitraanDto {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  toPersistence() {
    return { ...this };
  }
}

class CreateKegiatanKemitraanDto extends KegiatanKemitraanDto {
  static from(body = {}) {
    return new CreateKegiatanKemitraanDto(validate(createSchema, body));
  }
}

class UpdateKegiatanKemitraanDto extends KegiatanKemitraanDto {
  static from(body = {}) {
    return new UpdateKegiatanKemitraanDto(validate(updateSchema, body));
  }
}

module.exports = {
  CreateKegiatanKemitraanDto,
  UpdateKegiatanKemitraanDto,
  STATUSES,
};
