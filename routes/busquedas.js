const { Router } = require('express');
const {getTodo, getDocCollecion} = require('../controllers/busquedas');

const {validarJwt} = require('../middelwares/validar-jwt');

const router = Router();

router.get('/:busqueda',[validarJwt], getTodo);
router.get('/coleccion/:tabla/:busqueda',[validarJwt], getDocCollecion);

module.exports = router;