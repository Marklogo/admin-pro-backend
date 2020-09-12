const { response } = require("express");
const {generarJWT} = require("../helpers/jwt")
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  console.log(desde);

  const [usuarios, total] = await Promise.all([
    Usuario
          .find({}, "nombre email role google ")
          .skip(desde)
          .limit(5),
    Usuario.countDocuments()
  ]);

  res.json({
    ok: true,
    usuarios,
    total,
    uid: req.uid,
  });
};

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya existe",
      });
    }

    const usuario = new Usuario(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();
        // Generar token
    const token =  await generarJWT(usuario.id);
    res.json({
      ok: true,
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  //TODO: validar token y somprobar si es el usuario correcto
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El uid no existe",
      });
    }

    //Actualizacion
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe ese email en la base de datos",
        });
      }
    }
    campos.email = email;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
    try {
      const usuarioborrado = await Usuario.findByIdAndDelete(uid);
      if (!usuarioborrado) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese uid",
      });
    } else {
      return res.json({
        ok: true,
        usuario: usuarioborrado,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
