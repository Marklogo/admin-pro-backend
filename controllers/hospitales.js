const { response } = require("express");
const Hospital = require("../models/hospital");

const getHospitales = async (req, res) => {

  const hospitales = await Hospital.find().populate('usuario',"nombre img");


  res.json({
    ok: true,
    hospitales
  });
};

const crearHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({usuario: uid, ...req.body});

  try {
    const hospitalDB = await hospital.save();
    return res.json({
      ok: true,
      hospital: hospitalDB
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;
  try {
    let hospitalDB = await Hospital.findById(id);
    if(!hospitalDB){
      return res.status(404).json({
        ok: false,
        msg: "No existe un hospital cone ese id",
      });          
    }else{

      cambiosHospital = {
        ...req.body, 
        usuario:uid
      }

      const hospitalActualizado = await Hospital.findByIdAndUpdate(id,cambiosHospital,{new:true});
      return res.json({
        ok: true,
        hospital: hospitalActualizado
      });
      
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });    
  }

};

const borrarHospital = async (req, res = response) => {
  const id = req.params.id
  try {
    let hospitalDB = await Hospital.findById(id);
    if(!hospitalDB){
      return res.status(404).json({
        ok: false,
        msg: "No existe un hospital cone ese id",
      });          
    }
      await Hospital.findOneAndDelete(id)
      return res.json({
        ok: true,
        msg: 'Hospital borrado correctamente'
      });      
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });    
  }
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
