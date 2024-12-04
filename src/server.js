const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const categoriesRoutes = require('./routes/category')

dotenv.config();
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use(userRoutes);

app.use(productRoutes);
app.use(categoriesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
