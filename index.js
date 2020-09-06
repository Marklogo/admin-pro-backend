require('dotenv').config();

const express = require('express');
const cors = require('cors');


const {dbConection} = require('./database/config')

const app= express();

app.use(cors());
app.use(express.json());

dbConection();

//rutas
app.use ('/api/usuarios', require('./routes/usuarios'));
app.use ('/api/login', require('./routes/auth'));


app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en el puerto ' + process.env.PORT)
    });
