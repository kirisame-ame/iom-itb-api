const buildConfig = () => {
  const useSsl = (process.env.DB_SSL || '').toLowerCase() !== 'false';
  const baseConfig = {
    dialect: 'postgres',
    logging: false,
  };

  if (process.env.DATABASE_URL) {
    return {
      ...baseConfig,
      use_env_variable: 'DATABASE_URL',
      dialectOptions: useSsl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    };
  }

  return {
    ...baseConfig,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    dialectOptions: useSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  };
};

module.exports = {
  development: buildConfig(),
  test: buildConfig(),
  production: buildConfig(),
};
