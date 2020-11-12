const pg = require('pg');
const express = require('express');
const app = express();
const {syncAndSeed, db, Person, Place, Thing, Purchase} = require('./db')

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',async(req,res,next)=>{
  try {
    const people = await Person.findAll();
    const places = await Place.findAll();
    const things = await Thing.findAll();
    const purchases = await Purchase.findAll({
        include:[Person, Place, Thing]
    });


    res.send(`
      <html>
        <head>
        <style>
        form {
          display: flex;
          flex-direction: column;
        }
        form > * {
          margin: 0.5rem;
        }
        </style>
        </head>
        <body>
          <h1>Purchase</h1>
          <form method = 'POST'>
            <select name="personId">
              ${
                  people.map((person)=>`
                      <option value='${ person.id }'>${person.name}</option>
                  `).join('')
              }
            </select>
            <select name="thingId">
              ${
                  things.map( thing =>`
                      <option value='${ thing.id }'>${thing.name}</option>
                  `).join('')
              }
            </select>

            <select name="placeId">
              ${
                  places.map((place)=>`
                      <option value='${ place.id }'>${place.name}</option>
                  `).join('')
              }
            </select>
            <input type = 'text' name='count' />
            <input type = 'text' name='date' />

            <button>save</button>
          </form>
            <h1>Purchase</h1>
            ${
                purchases.map((purchase)=>`
                    <p>
                      ${purchase.person.name} purchased ${purchase.thing.name} (${purchase.count})
                      @ ${ purchase.place.name }
                      on ${ purchase.date }
                    </p>
                `).join('')
            }
        </body>
      </html>
  `);
  }
  catch(ex){
    next(ex);
  }
})

app.post('/', async(req,res,next)=>{
  try {
    const purchase = await Purchase.create(req.body);
    res.redirect('/');
  }
  catch(ex){
    next(ex);
  }

});




const init = async()=>{
    try{
        await db.authenticate();
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, ()=>console.log(`listening on port ${port}`));
    }catch(ex){
        console.log(ex);
    }
};

init();
