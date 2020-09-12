const { Router } = require('express');
const { check } = require('express-validator')
const {validarCampos} = require('../middelwares/validar-campos')
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos')
const {validarJwt} = require('../middelwares/validar-jwt');

const router = Router();

router.get('/',[
    validarJwt,
], getMedicos);

router.post('/',[
    validarJwt,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('hospital','El id de hospital no es valido').isMongoId(),
    validarCampos
], crearMedico);

router.put('/:id',[
], actualizarMedico);

router.delete('/:id',[
], borrarMedico);

module.exports = router;