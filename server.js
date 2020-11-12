const pg = require('pg');
const express = require('express');
const app = express();
const {syncAndSeed, db, People, Places, Things, Purchases} = require('./db')

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',async(req,res,next)=>{
    const people = await People.findAll();
    const places = await Places.findAll();
    const things = await Things.findAll();
    const purchases = await Purchases.findAll({
        include:[People]
    });
    console.log(purchases);

    // console.log(people);

    res.send(`
        <html>
        <head>
        </head>
        <body>
        <h1>Purchase</h1>
        <form method = 'POST'>
            <select name="PersonId">
                ${
                    people.map((person)=>`
                        <option value='PersonId'>${person.person}</option>
                    `)
                }
            </select>

            <select name="ThingId">
                ${
                    things.map((thing)=>`
                        <option>${thing.thing}</option>
                    `)
                }
            </select>

            <select name="place">
                ${
                    places.map((place)=>`
                        <option>${place.place}</option>
                    `)
                }
            </select>
            <input type = 'text' name='count' />

            <button>save</button>
            <h1>Purchases</h1>
            ${
                purchases.map((purchase)=>`
                    <p>${purchase.person} purchased ${purchase.thing}</p>
                `)
            }
        </form>
        </body>
    
    
    `);
})

app.post('/', async(req,res,next)=>{
    const purchase = await Purchases.create(req.body);
    res.redirect('/');
    //res.send(req.body);

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