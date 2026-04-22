const path = require('path');
// Try multiple paths for dotenv in different deployment environments
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config(); // Fallback to default .env location

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = require('./routes/index');

const getCorsOrigins = () => {
  const origins = new Set([
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'https://iom-itb-api.vercel.app',
    'https://iom-itb-app.vercel.app',
    'https://iom-itb-admin-nu.vercel.app',
  ]);

  if (process.env.WEB_APP_URL) origins.add(process.env.WEB_APP_URL);
  if (process.env.WEB_ADMIN_URL) origins.add(process.env.WEB_ADMIN_URL);
  if (process.env.API_UPLOAD_URL) origins.add(process.env.API_UPLOAD_URL);
  if (process.env.BASE_URL) origins.add(process.env.BASE_URL);

  if (process.env.NODE_ENV === 'production' && origins.size === 0) {
    console.warn('⚠️  No CORS origins configured! Please set WEB_APP_URL and WEB_ADMIN_URL environment variables.');
  }

  return Array.from(origins);
};

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getCorsOrigins();

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();

const swaggerOption = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API IOM',
      version: '1.0.0',
      description: 'Description of API IOM',
    },
    server: [
      {
        uri: process.env.BASE_URL,
      },
    ],
  },
  apis: ['./src/routes/swagger/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOption);
app.use(
  '/api',
  swaggerUi.serveFiles(swaggerSpec),
  swaggerUi.setup(swaggerSpec),
);

app.use(morgan('dev'));
// app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/', express.static(path.join(__dirname, '')));

app.use(router);


app.get('/', (req, res) => {
  res.json({
    message: 'SELAMAT DATANG DI API IOM',
  });
});

// forgotPasswordJob.start();

app.use(router);

// const endpoints = expressListEndpoints(app);
// console.log(endpoints);

module.exports = app;
