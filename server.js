const express = require('express');
const app = express();
const db = require('./db');

app.use(require('body-parser').urlencoded({ extended: false }));

app.get('/', (req, res, next)=> res.redirect('/users'));

app.use('/users', require('./routes/users'));

const port = process.env.PORT || 3000;

db.syncAndSeed();
app.listen(port, ()=> {
  console.log(`listening on port ${port}`);
});
