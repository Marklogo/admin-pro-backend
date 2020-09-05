require('dotenv').config();

const express = require('express');
const cors = require('cors');


const {dbConection} = require('./database/config')

const app= express();

app.use(cors());

dbConection();

//rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
});


app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en el puerto ' + process.env.PORT)
    });
