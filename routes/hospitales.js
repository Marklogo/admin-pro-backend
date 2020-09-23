const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middelwares/validar-campos");
const {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
} = require("../controllers/hospitales");
const { validarJwt } = require("../middelwares/validar-jwt");

const router = Router();

router.get("/", [validarJwt], getHospitales);

router.post(
  "/",
  [
    validarJwt,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearHospital
);

router.put(
  "/:id",
  [
    validarJwt,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarHospital
);

router.delete("/:id", [validarJwt], borrarHospital);

module.exports = router;
