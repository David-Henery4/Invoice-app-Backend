// Only these can access the API
const allowedOrigins = [
  "http://localhost:3500",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  // "http://www.invoice-app.netlify",
  // "http://www.invoice-app.com",
  // "http://www.invoice-app.co.uk",
  // "http://invoice-app.netlify",
  // "http://invoice-app.com",
  // "http://invoice-app.co.uk",
];

module.exports = allowedOrigins;
