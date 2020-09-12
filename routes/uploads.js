const { Router } = require('express');
const {fileUpload, retornaImagen} = require ('../controllers/uploads')
const expressFileUpload = require('express-fileupload');
const {validarJwt} = require('../middelwares/validar-jwt');



const router = Router();
router.use(expressFileUpload());

router.get('/:tipo/:foto',[validarJwt],retornaImagen );
router.put('/:tipo/:id',[validarJwt], fileUpload );

module.exports = router;