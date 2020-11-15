const express = require ('express');
const path = require ('path');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const exphbs=require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const noteRouts = require('./routes/notes');
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, 'public');

const app = express ();

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticDir))
app.use(noteRouts);

app.use(express.urlencoded({ extended: true }))

async function start () {
    
    try { await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useFindAndModify: false
    })
    app.listen(PORT, ()=> console.log(`Server started at port: `, PORT));

    } catch (e) {
        console.log(e)
    }
};

start();
