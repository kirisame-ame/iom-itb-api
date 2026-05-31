'use strict';

const { Donations, Faculties } = require('../../models');
const { Op } = require('sequelize');

const MONITORED_TYPES = ['iuran_sukarela', 'kontribusi_sukarela'];
const DEFAULT_DAYS = 30;
const STATUS_LABELS = ['pending', 'settlement', 'expired', 'failed', 'refunded'];

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAmount = (donation) => Number(donation.grossAmount || donation.amount || 0);

const addAmount = (target, amount, status) => {
  target.count += 1;
  target.totalAmount += amount;
  if (status === 'settlement') target.settledAmount += amount;
  if (status === 'pending') target.pendingAmount += amount;
};

const buildEmptyStatusSummary = () => STATUS_LABELS.map((status) => ({
  status,
  count: 0,
  totalAmount: 0,
}));

const normalizeTypeFilter = (value) => {
  if (!value || value === 'all') return MONITORED_TYPES;
  return MONITORED_TYPES.includes(value) ? [value] : MONITORED_TYPES;
};

const getPaymentMonitoring = async (query = {}) => {
  const today = new Date();
  const fallbackStart = new Date(today);
  fallbackStart.setDate(today.getDate() - (DEFAULT_DAYS - 1));

  const startDate = startOfDay(parseDate(query.startDate) || fallbackStart);
  const endDate = endOfDay(parseDate(query.endDate) || today);
  const donationTypes = normalizeTypeFilter(query.donationType);

  const where = {
    donationType: { [Op.in]: donationTypes },
    createdAt: { [Op.between]: [startDate, endDate] },
  };

  if (query.paymentStatus) {
    where.paymentStatus = query.paymentStatus;
  }

  if (query.paymentMethod) {
    where.paymentMethod = query.paymentMethod;
  }

  const donations = await Donations.findAll({
    where,
    attributes: [
      'id',
      'name',
      'email',
      'noWhatsapp',
      'amount',
      'grossAmount',
      'donationType',
      'facultyId',
      'kodeUnik',
      'paymentMethod',
      'paymentStatus',
      'paidAt',
      'date',
      'createdAt',
    ],
    order: [['createdAt', 'DESC']],
  });

  const facultyIds = [...new Set(donations.map((d) => d.facultyId).filter(Boolean))];
  const faculties = facultyIds.length
    ? await Faculties.findAll({
      where: { id: { [Op.in]: facultyIds } },
      attributes: ['id', 'name', 'kodeUnik'],
    })
    : [];
  const facultyMap = new Map(faculties.map((faculty) => [faculty.id, faculty]));

  const statusSummary = buildEmptyStatusSummary();
  const statusMap = new Map(statusSummary.map((item) => [item.status, item]));
  const typeMap = new Map();
  const methodMap = new Map();
  const facultySummaryMap = new Map();
  const trendMap = new Map();

  let totalAmount = 0;
  let settledAmount = 0;
  let pendingAmount = 0;
  let failedAmount = 0;
  let settledCount = 0;
  let pendingCount = 0;
  let expiredCount = 0;
  let failedCount = 0;

  donations.forEach((donation) => {
    const amount = getAmount(donation);
    const status = donation.paymentStatus || 'pending';
    const type = donation.donationType || 'unknown';
    const method = donation.paymentMethod || 'manual';
    const createdDate = new Date(donation.createdAt);
    const dateKey = formatDateKey(createdDate);
    const faculty = facultyMap.get(donation.facultyId);
    const facultyKey = donation.facultyId || 'none';

    totalAmount += amount;
    if (status === 'settlement') {
      settledAmount += amount;
      settledCount += 1;
    }
    if (status === 'pending') {
      pendingAmount += amount;
      pendingCount += 1;
    }
    if (status === 'expired') expiredCount += 1;
    if (status === 'failed') {
      failedAmount += amount;
      failedCount += 1;
    }

    const statusItem = statusMap.get(status) || { status, count: 0, totalAmount: 0 };
    statusItem.count += 1;
    statusItem.totalAmount += amount;
    statusMap.set(status, statusItem);

    const typeItem = typeMap.get(type) || { type, count: 0, totalAmount: 0, settledAmount: 0, pendingAmount: 0 };
    addAmount(typeItem, amount, status);
    typeMap.set(type, typeItem);

    const methodItem = methodMap.get(method) || { method, count: 0, totalAmount: 0, settledAmount: 0, pendingAmount: 0 };
    addAmount(methodItem, amount, status);
    methodMap.set(method, methodItem);

    const facultyItem = facultySummaryMap.get(facultyKey) || {
      facultyId: donation.facultyId || null,
      facultyName: faculty?.name || 'Tanpa Fakultas',
      kodeUnik: faculty?.kodeUnik || donation.kodeUnik || null,
      count: 0,
      totalAmount: 0,
      settledAmount: 0,
      pendingAmount: 0,
    };
    addAmount(facultyItem, amount, status);
    facultySummaryMap.set(facultyKey, facultyItem);

    const trendItem = trendMap.get(dateKey) || { date: dateKey, count: 0, totalAmount: 0, settledAmount: 0 };
    trendItem.count += 1;
    trendItem.totalAmount += amount;
    if (status === 'settlement') trendItem.settledAmount += amount;
    trendMap.set(dateKey, trendItem);
  });

  const recentPayments = donations.slice(0, 10).map((donation) => {
    const faculty = facultyMap.get(donation.facultyId);
    return {
      id: donation.id,
      name: donation.name,
      email: donation.email,
      noWhatsapp: donation.noWhatsapp,
      donationType: donation.donationType,
      facultyId: donation.facultyId,
      facultyName: faculty?.name || null,
      kodeUnik: donation.kodeUnik || faculty?.kodeUnik || null,
      amount: donation.amount,
      grossAmount: donation.grossAmount,
      paymentMethod: donation.paymentMethod,
      paymentStatus: donation.paymentStatus,
      paidAt: donation.paidAt,
      date: donation.date,
      createdAt: donation.createdAt,
    };
  });

  return {
    filters: {
      startDate: formatDateKey(startDate),
      endDate: formatDateKey(endDate),
      donationTypes,
      paymentStatus: query.paymentStatus || null,
      paymentMethod: query.paymentMethod || null,
    },
    kpis: {
      totalCount: donations.length,
      totalAmount,
      settledCount,
      settledAmount,
      pendingCount,
      pendingAmount,
      expiredCount,
      failedCount,
      failedAmount,
      settlementRate: donations.length ? Math.round((settledCount / donations.length) * 100) : 0,
    },
    statusSummary: Array.from(statusMap.values()),
    typeSummary: Array.from(typeMap.values()).sort((a, b) => b.totalAmount - a.totalAmount),
    methodSummary: Array.from(methodMap.values()).sort((a, b) => b.totalAmount - a.totalAmount),
    facultySummary: Array.from(facultySummaryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount),
    dailyTrend: Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
    recentPayments,
  };
};

module.exports = {
  getPaymentMonitoring,
};
