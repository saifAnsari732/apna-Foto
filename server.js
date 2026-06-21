require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const aiRoutes = require('./routes/ai');
const imagekitRoutes = require('./routes/imagekit');
const templateRoutes = require('./routes/template');

const app = express();
app.use(cors());
app.use(express.json());
  
// MongoDB Connection
const MONGO_URI ='mongodb://kisandeveloper2_db_user:s3inMXmppkgFYGXF@ac-arqlgvg-shard-00-00.vpmg6fg.mongodb.net:27017,ac-arqlgvg-shard-00-01.vpmg6fg.mongodb.net:27017,ac-arqlgvg-shard-00-02.vpmg6fg.mongodb.net:27017/?ssl=true&replicaSet=atlas-6qhyy7-shard-0&authSource=admin&appName=Cluster0';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/templates', templateRoutes);

app.get('/', (req, res) => {
  res.send('PosterMagic Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
