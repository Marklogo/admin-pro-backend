const { response } = require("express");
const bcrypt = require('bcryptjs')
const usuario = require("../models/usuario");
const {generarJWT} = require("../helpers/jwt")



const login = async (req, res = response) => {
    const {email, password } = req.body;
    try {

        const usuarioDB = await usuario.findOne({email});
        
        if (!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:"email no encontrado"
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword){
            return res.status(400).json({
                ok:false,
                msg:"contraseña no valida"
            });
        }

    // Generar token
        const token =  await generarJWT(usuarioDB.id);
        

    res.json({
        ok:true,
        token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
    login,
}