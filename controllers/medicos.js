const { response } = require("express");
const medico = require("../models/medico");

const Medico = require("../models/medico");

const getMedicos = async (req, res) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img");

  return res.json({
    ok: true,
    medicos,
  });
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({ usuario: uid, ...req.body });

  try {
    const medicoDB = await medico.save();
    return res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const medicoDB = await Medico.findById(id);
 
    if (!medicoDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un medico con ese Id",
      });
    }

    const medicoCambios = { ...req.body, usuario: uid };

    medicoActualizado = await Medico.findByIdAndUpdate(id, medicoCambios, {
      new: true,
    });
    return res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarMedico = async (req, res = response) => {
  const id = req.params.id;
  
  try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un medico con ese Id",
      });
    }  

    await Medico.findByIdAndDelete(id);
    return res.json({
      ok: true,
      msg: "Medico borrado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
