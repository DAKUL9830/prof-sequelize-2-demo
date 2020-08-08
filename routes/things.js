const router = require('express').Router();
const { User, Thing } = require('../db').models;

module.exports = router;


router.post('/', async(req, res, next)=> {
  try {
    const thing = await Thing.create({
      name:  req.body.name,
      userId: req.body.userId
    });
    res.redirect(`/users/${thing.userId}`);
  }
  catch(ex){
    next(ex);
  }
});



router.get('/add', async(req, res, next)=> {
  try {
    const users = await User.findAll();
    res.send(`
      <html>
        <body>
          <a href='/users'>Cancel</a>
          <form method='POST' action='/things'>
            <input name='name' />
            <select name='userId'>
              ${
                users.map( user => {
                  return `
                    <option value='${user.id}'>
                      ${ user.name }
                    </option>
                  `;
                }).join('')
              }
            </select>
            <button>Create</button>
          </form>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

