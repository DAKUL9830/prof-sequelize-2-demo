const Sequelize = require('sequelize');
const { STRING, TEXT, ARRAY } = Sequelize; 
const VIRTUAL = Sequelize.VIRTUAL;
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
  },
  adjectives: {
    type: ARRAY(STRING),
    defaultValue: []
  }
});

User.byLetter = function(letter){
  return this.findAll({
    where: {
      name: {
        [Sequelize.Op.like]: `${letter}%`
      }
    }
  });
}

User.prototype.findSimilar = function(){
  return User.findAll({
    where: {
      adjectives: {
        [Sequelize.Op.overlap]: this.adjectives 
      }
    }
  });
}

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
  if(process.env.NOSYNC === 'true'){
    return;
  }
  await conn.sync({ force: true });
  const [ moe, lucy, larry ] = await Promise.all([
    User.create({ name: 'moe', adjectives: ['smart', 'short'] }),
    User.create({ name: 'lucy', adjectives: ['tall', 'smart']  }),
    User.create({ name: 'larry', adjectives: ['short'] }),
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
