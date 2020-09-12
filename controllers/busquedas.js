const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')


const getTodo =  async (req, res) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');
  
  const [medicos, hospitales, usuarios] = await Promise.all([
     Medico.find({ nombre: regex }),
     Hospital.find({ nombre: regex }),
     Usuario.find({ nombre: regex })
  ])

  res.json({
    ok: true,
    usuarios,
    medicos,
    hospitales
  });
};

const getDocCollecion =  async (req, res) => {
  const tabla = req.params.tabla
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');
  
  let data = [];

  switch (tabla) {
    case 'medicos': 
         data = await Medico.find({ nombre: regex })
                      .populate('usuario', 'nombre img')
                      .populate('hospital', 'nombre img');
    break;

    case 'hospitales': 
          data = await Hospital.find({ nombre: regex })
                        .populate('usuario', 'nombre img');
    break;

    case 'usuarios': 
          data = await Usuario.find({ nombre: regex });
    break;
  
    default:
      return res.status(400).json({
        ok: true,
        msg: 'La tabla tiene que ser usuarios, medicos u hospitales'
      });

  }

  res.json({
    ok: true,
    resultados: data
  });
};





module.exports = {
  getTodo,
  getDocCollecion
};
