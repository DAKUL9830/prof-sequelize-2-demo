const express = require('express');
const app = express();
const db = require('./db');
const chalk = require('chalk');

app.use(require('body-parser').urlencoded({ extended: false }));
console.log(require('method-override')('_method').toString());
app.use(require('method-override')('_method'));

app.get('/', (req, res, next)=> res.redirect('/users'));


app.use('/users', require('./routes/users'));

app.use((req, res, next)=> {
  const error = Error(`Page not found (${ req.url }) for method ${req.method}!!`);
  error.status = 404;
  next(error);
});


app.use((err, req, res, next)=> {
  console.log(chalk.red(err));
  console.log(chalk.red(err.stack));
  res.status(err.status || 500).send(`
    <h1>Error on page</h1>
    <p style='color:red'>${ err.stack }</p>
    <a href='/'>Try Again</a>
  `);
});


const port = process.env.PORT || 3000;

db.syncAndSeed();
app.listen(port, ()=> {
  console.log(`listening on port ${port}`);
});
