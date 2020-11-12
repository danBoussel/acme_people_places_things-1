//const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');
const {STRING, INTEGER, DATE} = Sequelize;


const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/ppp_db');

const People = db.define('People',{
    person: STRING
});
const Places = db.define('Places',{
    place: STRING
});
const Things = db.define('Things',{
    thing: STRING
});
const Purchases = db.define('Purchases',{
    number: INTEGER,
    date: DATE

})


// Things.belongsTo(People);
// People.hasMany(Things);

// Places.hasMany(Things);
// Things.belongsTo(Places);

//Places.belongsTo(People);
//People.hasMany(Places);

Purchases.belongsTo(People);
People.hasMany(Purchases);

Things.hasMany(Purchases);
Purchases.belongsTo(Things);

Places.hasMany(Purchases);
Purchases.belongsTo(Places);


const syncAndSeed = async()=>{
    await db.sync({force:true});
    await People.create({person: 'moe'});
    await People.create({person: 'lucy'});
    await People.create({person: 'lary'});

    await Places.create({place: 'NYC'});
    await Places.create({place: 'Chicago'});
    await Places.create({place: 'LA'});
    await Places.create({place: 'Dallas'});

    await Things.create({thing: 'foo'});
    await Things.create({thing: 'bar'});
    await Things.create({thing: 'bazz'});
    await Things.create({thing: 'qua'});

    await Purchases.create({number: 3,date: new Date()});
    
}



module.exports = {
    syncAndSeed,
    db,
    People,
    Places,
    Things,
    Purchases
}