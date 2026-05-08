import express from 'express';
import professionalController from '../controller/professionalController.js';
const router = new express.Router();


router.get('/', professionalController.getProfessionalData);


export default router;