require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

/* -----------------------
 * MongoDB
 * --------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

/* -----------------------
 * Proxies (Render)
 * Enables secure cookies & sameSite=None over HTTPS
 * --------------------- */
app.set('trust proxy', 1);

/* -----------------------
 * CORS
 * --------------------- */
const envList = (s) =>
  (s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

// Exact origins (protocol + host). Add all production variants.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  ...envList(process.env.CORS_ORIGINS),  // e.g. "https://your-site.netlify.app,https://yourdomain.com,https://www.yourdomain.com"
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);

// Optional: quick visibility in logs
console.log('✓ Allowed CORS origins:', ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : '(none set)');

const corsOptions = {
  origin(origin, callback) {
    // allow requests without Origin (health checks, curl)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Don’t throw; just block
    console.warn(`⚠️  CORS blocked for origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  optionsSuccessStatus: 204, // some clients prefer 204 over 200 for preflight
};

app.use(cors(corsOptions));
// Ensure preflights work globally
app.options('*', cors(corsOptions));


/* -----------------------
 * Body parsing
 * --------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------
 * Sessions (cookie-based)
 * For cross-site cookies on Netlify↔Render:
 *   - secure: true
 *   - sameSite: 'none'
 * Requires HTTPS (Render + Netlify provide this).
 * --------------------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: IS_PROD,                 // HTTPS only in prod
      sameSite: IS_PROD ? 'none' : 'lax',
    },
  })
);

/* -----------------------
 * API routes
 * --------------------- */
app.use('/api', routes);

/* -----------------------
 * Health checks
 * Keep both paths for convenience
 * --------------------- */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

/* -----------------------
 * Keep-alive (optional)
 * Prefer external public URL if available so it prevents sleep
 * --------------------- */
const TWO_MINUTES = 120_000;
const PUBLIC_BASE =
  process.env.KEEPALIVE_URL?.trim() ||
  process.env.RENDER_EXTERNAL_URL?.trim() ||
  `http://localhost:${PORT}`;

const KEEPALIVE_URL = `${PUBLIC_BASE.replace(/\/+$/, '')}/health`;

async function pingKeepAlive() {
  try {
    // Node 18+ has global fetch
    const res = await fetch(KEEPALIVE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // console.log(`[keepalive] OK -> ${KEEPALIVE_URL}`);
  } catch (e) {
    console.log(`[keepalive] ERR -> ${KEEPALIVE_URL} :: ${e.message}`);
  }
}
setTimeout(pingKeepAlive, 5000);
setInterval(pingKeepAlive, TWO_MINUTES);

/* -----------------------
 * Start
 * --------------------- */
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ CORS origins: ${ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS.join(', ') : '(none set)'}`);
  console.log(`✓ Keepalive pings -> ${KEEPALIVE_URL} every ${TWO_MINUTES / 1000}s`);
});
