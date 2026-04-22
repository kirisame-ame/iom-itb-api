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

// Konfigurasi CORS - Dynamic origins dari environment variables
const getCorsOrigins = () => {
  const origins = [];
  
  // Development origins (hanya jika NODE_ENV development)
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    origins.push('http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081');
  }
  
  // Production origins dari environment variables
  if (process.env.WEB_APP_URL) origins.push(process.env.WEB_APP_URL);
  if (process.env.WEB_ADMIN_URL) origins.push(process.env.WEB_ADMIN_URL);
  if (process.env.API_UPLOAD_URL) origins.push(process.env.API_UPLOAD_URL);
  
  // Fallback untuk production jika env vars tidak ada
  if (process.env.NODE_ENV === 'production' && origins.length === 0) {
    console.warn('⚠️  No CORS origins configured! Please set WEB_APP_URL and WEB_ADMIN_URL environment variables.');
  }
  
  return origins;
};

const corsOptions = {
  origin: getCorsOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
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

// Tally webhook needs raw body for signature verification.
app.use('/webhooks/tally', express.raw({ type: 'application/json' }));

// Manual CORS implementation
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = corsOptions.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  
  next();
});

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
