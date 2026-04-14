const ROLE_ACCESS_MAP = {
  admin: [
    'web',
    'aplikasi-bankes',
    'aplikasi-ota',
    'aplikasi-akunting',
    'aplikasi-sekretariat',
    'aplikasi-issumit',
    'aplikasi-oki-manajemen-informasi',
  ],
  'pengurus-bidang-1': ['web', 'aplikasi-issumit', 'aplikasi-oki-manajemen-informasi'],
  'pengurus-bidang-2': ['aplikasi-bankes', 'aplikasi-ota'],
  mahasiswa: ['aplikasi-ota'],
  'orang-tua-asuh': ['aplikasi-bankes'],
  'volunteer-pewawancara': ['aplikasi-bankes'],
  sekretariat: ['aplikasi-sekretariat'],
  bendahara: ['aplikasi-akunting'],
};

const APP_CATALOG = {
  web: {
    id: 'web',
    name: 'Dashboard Admin',
    description: 'Portal web IOM',
    iconKey: 'dashboard',
    color: '#1e40af',
    colorLight: '#eff6ff',
    envKey: 'SSO_APP_URL_WEB',
    defaultUrl: '/dashboard',
  },
  'aplikasi-bankes': {
    id: 'aplikasi-bankes',
    name: 'Aplikasi Bankes',
    description: 'Modul bantuan dan kesejahteraan',
    iconKey: 'finance',
    color: '#0f766e',
    colorLight: '#ecfeff',
    envKey: 'SSO_APP_URL_APLIKASI_BANKES',
    defaultUrl: '#',
  },
  'aplikasi-ota': {
    id: 'aplikasi-ota',
    name: 'Aplikasi OTA',
    description: 'Modul orang tua asuh',
    iconKey: 'globe',
    color: '#7c3aed',
    colorLight: '#f5f3ff',
    envKey: 'SSO_APP_URL_APLIKASI_OTA',
    defaultUrl: '#',
  },
  'aplikasi-akunting': {
    id: 'aplikasi-akunting',
    name: 'Aplikasi Akunting',
    description: 'Modul akunting dan keuangan',
    iconKey: 'finance',
    color: '#b45309',
    colorLight: '#fffbeb',
    envKey: 'SSO_APP_URL_APLIKASI_AKUNTING',
    defaultUrl: '#',
  },
  'aplikasi-sekretariat': {
    id: 'aplikasi-sekretariat',
    name: 'Aplikasi Sekretariat',
    description: 'Modul sekretariat',
    iconKey: 'dashboard',
    color: '#334155',
    colorLight: '#f8fafc',
    envKey: 'SSO_APP_URL_APLIKASI_SEKRETARIAT',
    defaultUrl: '#',
  },
  'aplikasi-issumit': {
    id: 'aplikasi-issumit',
    name: 'Aplikasi ISSUMIT',
    description: 'Modul ISSUMIT',
    iconKey: 'globe',
    color: '#1d4ed8',
    colorLight: '#dbeafe',
    envKey: 'SSO_APP_URL_APLIKASI_ISSUMIT',
    defaultUrl: '#',
  },
  'aplikasi-oki-manajemen-informasi': {
    id: 'aplikasi-oki-manajemen-informasi',
    name: 'Aplikasi OKI Manajemen Informasi',
    description: 'Modul OKI manajemen informasi',
    iconKey: 'dashboard',
    color: '#166534',
    colorLight: '#f0fdf4',
    envKey: 'SSO_APP_URL_APLIKASI_OKI_MANAJEMEN_INFORMASI',
    defaultUrl: '#',
  },
};

function toDisplayRole(role) {
  return String(role || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getUserRolesFromToken(decoded) {
  const realmRoles = decoded?.realm_access?.roles || [];
  const resourceRoles = Object.values(decoded?.resource_access || {}).flatMap((entry) => entry?.roles || []);
  return [...new Set([...realmRoles, ...resourceRoles])];
}

function getAppUrl(appId) {
  const app = APP_CATALOG[appId];
  if (!app) return '#';
  return process.env[app.envKey] || app.defaultUrl;
}

function getAccessibleAppIds(roles) {
  const appSet = new Set();
  roles.forEach((role) => {
    (ROLE_ACCESS_MAP[role] || []).forEach((appId) => appSet.add(appId));
  });
  return [...appSet];
}

function buildAccessibleApps(roles) {
  return getAccessibleAppIds(roles)
    .map((appId) => {
      const app = APP_CATALOG[appId];
      if (!app) return null;

      const eligibleRoles = roles.filter((role) => (ROLE_ACCESS_MAP[role] || []).includes(appId));

      return {
        id: app.id,
        name: app.name,
        description: app.description,
        url: getAppUrl(app.id),
        color: app.color,
        colorLight: app.colorLight,
        iconKey: app.iconKey,
        roles: eligibleRoles.map((role) => ({
          id: role,
          name: toDisplayRole(role),
          description: `Akses sebagai ${toDisplayRole(role)}`,
        })),
      };
    })
    .filter(Boolean);
}

function isRoleAllowedForApp(role, appId) {
  return (ROLE_ACCESS_MAP[role] || []).includes(appId);
}

function isAnyRoleAllowed(roles, appId) {
  return roles.some((role) => isRoleAllowedForApp(role, appId));
}

module.exports = {
  APP_CATALOG,
  ROLE_ACCESS_MAP,
  buildAccessibleApps,
  getAppUrl,
  getUserRolesFromToken,
  isAnyRoleAllowed,
  isRoleAllowedForApp,
};
