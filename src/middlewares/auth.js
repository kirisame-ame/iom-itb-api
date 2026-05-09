const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const keycloakIssuer = process.env.KEYCLOAK_ISSUER_URL;
const keycloakJwksUri = process.env.KEYCLOAK_JWKS_URI;
const keycloakAudience = process.env.KEYCLOAK_AUDIENCE || '';

const client = keycloakJwksUri
    ? jwksClient({
            jwksUri: keycloakJwksUri,
            cache: true,
            cacheMaxEntries: 5,
            cacheMaxAge: 10 * 60 * 1000,
            rateLimit: true,
        })
    : null;

function getKey(header, callback) {
    if (!client) {
        return callback(new Error('JWKS client is not configured'));
    }
    client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        return callback(null, key.getPublicKey());
    });
}

const JWTValidation = (req, res, next) => {
    if (process.env.DEV_BYPASS_AUTH === 'true') {
        req.user = { sub: 'dev', email: 'dev@local', preferred_username: 'dev', roles: ['admin'], isVerified: true, roleName: 'admin' };
        req.payload = { id: 'dev', email: 'dev@local' };
        res.locals.user = req.user;
        return next();
    }

    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            message: 'Missing Bearer token',
        });
    }

    if (!keycloakIssuer || !keycloakJwksUri) {
        return res.status(500).json({
            status: 500,
            message: 'SSO is not configured on API service',
        });
    }

    const jwtToken = authorization.split(' ')[1];

    const verifyOptions = {
        issuer: keycloakIssuer,
        algorithms: ['RS256'],
    };

    if (keycloakAudience) {
        verifyOptions.audience = keycloakAudience;
    }

    return jwt.verify(jwtToken, getKey, verifyOptions, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid token',
                details: err.message,
            });
        }

        const roles = [
            ...(decoded?.realm_access?.roles || []),
            ...Object.values(decoded?.resource_access || {}).flatMap((entry) => entry?.roles || []),
        ];

        const normalizedUser = {
            ...decoded,
            roles: [...new Set(roles)],
            isVerified: true,
            roleName: roles[0] || null,
            roleId: null,
        };

        req.user = normalizedUser;
        req.payload = {
            id: decoded.sub,
            email: decoded.email,
        };
        res.locals.user = normalizedUser;

        return next();
    });
};

module.exports = JWTValidation;
