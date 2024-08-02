const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db = new sqlite3.Database('./db/database.sqlite');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });

    req.userId = decoded.id;
    next();
  });
};

router.use(authMiddleware);

router.post('/', (req, res) => {
  const { description, status } = req.body;
  db.run("INSERT INTO todos (user_id, description, status) VALUES (?, ?, ?)", [req.userId, description, status], function(err) {
    if (err) {
      return res.status(400).json({ error: "Could not create to-do item" });
    }
    res.status(201).json({ message: "To-do item created successfully" });
  });
});

router.get('/', (req, res) => {
  db.all("SELECT * FROM todos WHERE user_id = ?", [req.userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: "Could not fetch to-do items" });
    }
    res.json(rows);
  });
});

router.put('/:id', (req, res) => {
  const { description, status } = req.body;
  db.run("UPDATE todos SET description = ?, status = ? WHERE id = ? AND user_id = ?", [description, status, req.params.id, req.userId], function(err) {
    if (err) {
      return res.status(400).json({ error: "Could not update to-do item" });
    }
    res.json({ message: "To-do item updated successfully" });
  });
});

router.delete('/:id', (req, res) => {
  db.run("DELETE FROM todos WHERE id = ? AND user_id = ?", [req.params.id, req.userId], function(err) {
    if (err) {
      return res.status(400).json({ error: "Could not delete to-do item" });
    }
    res.json({ message: "To-do item deleted successfully" });
  });
});

module.exports = router;
