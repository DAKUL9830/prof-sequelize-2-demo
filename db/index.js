const Sequelize = require('sequelize');
const { STRING, TEXT, VIRTUAL } = Sequelize; 
const conn = new Sequelize('postgres://localhost/acme_db');

const User = conn.define('user', {
  name: {
    type: STRING,
    allowNull: false
  },
  bio: {
    type: TEXT
  },
  nickname: {
    type: VIRTUAL,
    get: function(){
      return this.name.slice(0, 2);
    }
  }
});

User.beforeSave( user => {
  user.bio = `Bio for ${user.name}`;

});

const Thing = conn.define('thing', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Thing.belongsTo(User);
User.hasMany(Thing);

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const [ moe, lucy, larry ] = await Promise.all([
    User.create({ name: 'moe' }),
    User.create({ name: 'lucy' }),
    User.create({ name: 'larry' }),
  ]);
  const [ foo, bar, bazz, quq ] = await Promise.all([
    Thing.create({ name: 'foo', userId: moe.id }),
    Thing.create({ name: 'bar', userId: lucy.id }),
    Thing.create({ name: 'bazz', userId: moe.id }),
    Thing.create({ name: 'quq' }),
  ]);
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Thing
  }
};
