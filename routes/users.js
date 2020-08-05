const router = require('express').Router();
const { User, Thing } = require('../db').models;

module.exports = router;

router.get('/', async(req, res, next)=> {
  try {
    const users = await User.findAll();
    res.send(`
      <html>
        <body>
          <a href='/users/add'>Add A User</a>
          <ul>
            ${
              users.map(user => {
                return `
                  <li>
                    <a href='/users/${user.id}'>
                      ${ user.name } (${ user.nickname })
                    </a>
                  </li>
                `;
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

router.post('/', async(req, res, next)=> {
  try {
    const user = await User.create({ name:  req.body.name });
    res.redirect(`/users/${user.id}`);
  }
  catch(ex){
    next(ex);
  }
});

router.get('/add', (req, res, next)=> {
  res.send(`
    <html>
      <body>
        <a href='/users'>Cancel</a>
        <form method='POST' action='/users'>
          <input name='name' />
          <button>Create</button>
        </form>
      </body>
    </html>
  `);
});

router.get('/:id', async(req, res, next)=> {
  try {
    const user = await User.findByPk(req.params.id, { include: [ Thing ]});
    res.send(`
      <html>
        <body>
          <a href='/users'>All Users</a>
          <h1>${ user.name }</h1>
          <p>${ user.bio }</p>
          <ul>
            ${
              user.things.map(thing => {
                return `
                  <li>
                    ${ thing.name }
                  </li>
                `;
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});
