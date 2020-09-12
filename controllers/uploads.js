
const { response } = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {actualizarImagen} = require('../helpers/actualizar-Imagen');


const fileUpload =  async (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos=['hospitales','medicos','usuarios'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok:false,
      msg: 'No es un tipo valido'
    });
  }
  
  //Validar que exista un archivo
  if(!req.files || Object.keys(req.files).length ===0){
    return res.status(500).json({
      ok: false,
      msg: 'No se ha seleccionado ningun fichero'
    });
  }

  //Procesar la imagen...
  const file = req.files.imagen;
  const nombreCortado = file.name.split('.');
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];
  
  //validar extension
  const extensionesValidas=['jpg','bmp','png'];
  if(!extensionesValidas.includes(extensionArchivo)){
    return res.status(500).json({
      ok: false,
      msg: 'No es un tipo de archivo valido'
    });
  }
  
  const nombreArchivo= uuidv4() + '.' +extensionArchivo;
  const path = `./uploads/${tipo}/${nombreArchivo}`

  file.mv(path, function(err){
    if (err)
      return res.status(500).json({
        ok:false,
        msg:'No ha podido subirse la imagen'
      });

      //Actualizar Imagen
      actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: 'Se ha subido la imagen'
    });
  });
};


const retornaImagen = (req, res = response) =>{
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);
  if (fs.existsSync(pathImg)){
    res.sendFile(pathImg);
  }else{
    res.sendFile(path.join(__dirname,`../assets/no-img.png`));
  }

}




module.exports = {
  fileUpload,
  retornaImagen
};
