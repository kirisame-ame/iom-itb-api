const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

// TODO: cuma bankes yg pake fitur registrasi, takut rolenya kelebihan, security concerns
const VALID_ROLES = [
  'pengurus-bidang-1',
  'pengurus-bidang-2',
  'mahasiswa',
  'orang-tua-asuh',
  'volunteer-pewawancara',
  'sekretariat',
  'bendahara',
];

function parseKeycloakUrl(issuerUrl) {
  const match = issuerUrl.match(/^(https?:\/\/.+?)\/realms\/(.+)$/);
  if (!match) {
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Invalid KEYCLOAK_ISSUER_URL format — expected https://host/realms/realmName',
    });
  }
  return { baseUrl: match[1], realm: match[2] };
}

async function getAdminToken(baseUrl, realm) {
  const clientId = process.env.KEYCLOAK_ADMIN_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_ADMIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Keycloak admin client credentials are not configured',
    });
  }

  const res = await fetch(
    `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to get Keycloak admin token: ${text}`,
    });
  }

  const data = await res.json();
  return data.access_token;
}

async function createKeycloakUser(baseUrl, realm, adminToken, { email, password, username, firstName, lastName }) {
  const payload = {
    username: username || email,
    email,
    enabled: true,
    emailVerified: true,
    credentials: [{ type: 'password', value: password, temporary: false }],
  };

  if (firstName) payload.firstName = firstName;
  if (lastName) payload.lastName = lastName;

  const res = await fetch(`${baseUrl}/admin/realms/${realm}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 409) {
    throw new BaseError({
      status: StatusCodes.CONFLICT,
      message: 'A user with this email already exists',
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create user in Keycloak: ${text}`,
    });
  }

  // Keycloak returns the new user's URL in the Location header
  const location = res.headers.get('location');
  if (!location) {
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Keycloak did not return a user location after creation',
    });
  }

  return location.split('/').pop();
}

async function getRealmRole(baseUrl, realm, adminToken, roleName) {
  const res = await fetch(
    `${baseUrl}/admin/realms/${realm}/roles/${encodeURIComponent(roleName)}`,
    {
      headers: { Authorization: `Bearer ${adminToken}` },
    }
  );

  if (res.status === 404) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: `Role "${roleName}" does not exist in Keycloak realm`,
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to fetch role from Keycloak: ${text}`,
    });
  }

  return res.json();
}

async function assignRealmRole(baseUrl, realm, adminToken, userId, role) {
  const res = await fetch(
    `${baseUrl}/admin/realms/${realm}/users/${userId}/role-mappings/realm`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ id: role.id, name: role.name }]),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to assign role in Keycloak: ${text}`,
    });
  }
}

const registerKeycloakUser = async ({ email, password, role, username, firstName, lastName }) => {
  if (!email || !password || !role) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'email, password, and role are required',
    });
  }

  if (!VALID_ROLES.includes(role)) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`,
    });
  }

  const issuerUrl = process.env.KEYCLOAK_ISSUER_URL;
  if (!issuerUrl) {
    throw new BaseError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'KEYCLOAK_ISSUER_URL is not configured',
    });
  }

  const { baseUrl, realm } = parseKeycloakUrl(issuerUrl);
  const adminToken = await getAdminToken(baseUrl, realm);
  const userId = await createKeycloakUser(baseUrl, realm, adminToken, { email, password, username, firstName, lastName });
  const roleObj = await getRealmRole(baseUrl, realm, adminToken, role);
  await assignRealmRole(baseUrl, realm, adminToken, userId, roleObj);

  return { userId, email, role };
};

module.exports = registerKeycloakUser;
