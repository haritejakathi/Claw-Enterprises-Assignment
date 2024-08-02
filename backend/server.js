require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todosRoutes = require('./routes/todos');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todosRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
