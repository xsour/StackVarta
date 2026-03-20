require('dotenv').config();

const path = require('node:path');
const express = require('express');
const cors = require('cors');

const articlesRoutes = require('./routes/articles');
const categoriesRoutes = require('./routes/categories');
const tagsRoutes = require('./routes/tags');
const authorsRoutes = require('./routes/authors');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const healthRoutes = require('./routes/health');
const aboutRoutes = require('./routes/about');
const store = require('./models/store');
const { notFound } = require('./middleware/not-found');
const { errorHandler } = require('./middleware/error-handler');

const app = express();
const port = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);

app.set('trust proxy', 1);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((item) => item.trim()) : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({
    data: {
      service: 'IT Blog API',
      database: store.getDbMode(),
      docs: [
        '/api/health',
        '/api/articles',
        '/api/categories',
        '/api/tags',
        '/api/auth/login',
        '/api/admin/articles'
      ]
    }
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  try {
    await store.initStore();
    app.listen(port, '0.0.0.0', () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('[bootstrap] failed to start backend');
    console.error(error);
    process.exit(1);
  }
}

bootstrap();
