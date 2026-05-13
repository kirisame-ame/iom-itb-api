const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const { Merchandises, MerchandiseCategories, sequelize } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

const normalizeCategory = (category) => String(category || '').trim();

const assertCategory = (category) => {
  const normalized = normalizeCategory(category);
  if (!normalized) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Nama kategori merchandise wajib diisi',
    });
  }
  return normalized;
};

const getMerchandiseCategories = async () => {
  const [masterCategories, merchandiseCategories] = await Promise.all([
    MerchandiseCategories.findAll({
      attributes: ['name'],
      order: [['name', 'ASC']],
    }),
    Merchandises.findAll({
      attributes: ['kategori'],
      where: { kategori: { [Op.ne]: null } },
      group: ['kategori'],
      order: [['kategori', 'ASC']],
    }),
  ]);

  return [
    ...new Set([
      ...masterCategories.map((row) => row.name),
      ...merchandiseCategories.map((row) => row.kategori),
    ].map(normalizeCategory).filter(Boolean)),
  ].sort((left, right) => left.localeCompare(right, 'id', { sensitivity: 'base' }));
};

const createMerchandiseCategory = async (category) => {
  const name = assertCategory(category);
  const [record] = await MerchandiseCategories.findOrCreate({
    where: { name },
    defaults: { name },
  });

  return record;
};

const updateMerchandiseCategory = async (oldCategory, nextCategory) => {
  const currentName = assertCategory(oldCategory);
  const nextName = assertCategory(nextCategory);

  return sequelize.transaction(async (transaction) => {
    if (currentName === nextName) {
      const [record] = await MerchandiseCategories.findOrCreate({
        where: { name: nextName },
        defaults: { name: nextName },
        transaction,
      });
      return { category: record.name, affectedCount: 0 };
    }

    const [targetRecord] = await MerchandiseCategories.findOrCreate({
      where: { name: nextName },
      defaults: { name: nextName },
      transaction,
    });

    await MerchandiseCategories.destroy({
      where: { name: currentName },
      transaction,
    });

    const [affectedCount] = await Merchandises.update(
      { kategori: nextName },
      {
        where: { kategori: currentName },
        transaction,
      },
    );

    return { category: targetRecord.name, affectedCount };
  });
};

const deleteMerchandiseCategory = async (category) => {
  const name = assertCategory(category);

  return sequelize.transaction(async (transaction) => {
    await MerchandiseCategories.destroy({
      where: { name },
      transaction,
    });

    const [affectedCount] = await Merchandises.update(
      { kategori: null },
      {
        where: { kategori: name },
        transaction,
      },
    );

    return {
      category: name,
      affectedCount,
      message: affectedCount > 0
        ? `Kategori ${name} berhasil dihapus dari ${affectedCount} merchandise`
        : `Kategori ${name} berhasil dihapus`,
    };
  });
};

module.exports = {
  createMerchandiseCategory,
  deleteMerchandiseCategory,
  getMerchandiseCategories,
  updateMerchandiseCategory,
};
