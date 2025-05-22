const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error('MongoDB connection failed:', err));


const cron = require('node-cron');
const scanFrauds = require('./utils/fraudScanner');

// Schedule to run every day at midnight
cron.schedule('0 0 * * *', () => {
  scanFrauds();
});
