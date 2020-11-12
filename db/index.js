//const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');
const {STRING, INTEGER, DATE} = Sequelize;


const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/ppp_db');

const Person = db.define('person',{
    name: {
      type: STRING,
      allowNull: false
    }
});
const Place = db.define('place',{
    name: {
      type: STRING,
      allowNull: false
    }
});
const Thing = db.define('thing',{
    name: {
      type: STRING,
      allowNull: false
    }
});
const Purchase = db.define('purchase',{
    count: {
      type: INTEGER,
      defaultValue: 5
    },
    date: DATE

})

Purchase.belongsTo(Person);

Purchase.belongsTo(Thing);

Purchase.belongsTo(Place);


const syncAndSeed = async()=>{
  //TODO - use Promise.all
    await db.sync({force:true});
    const moe = await Person.create({name: 'moe'});
    await Person.create({name: 'lucy'});
    await Person.create({name: 'lary'});

    const nyc = await Place.create({name: 'NYC'});
    await Place.create({name: 'Chicago'});
    await Place.create({name: 'LA'});
    await Place.create({name: 'Dallas'});

    const foo = await Thing.create({name: 'foo'});
    await Thing.create({name: 'bar'});
    await Thing.create({name: 'bazz'});
    await Thing.create({name: 'qua'});

    await Purchase.create({ personId: moe.id, placeId: nyc.id, thingId: foo.id, number: 3,date: new Date()});
    
}



module.exports = {
    syncAndSeed,
    db,
    Person,
    Place,
    Thing,
    Purchase
}
