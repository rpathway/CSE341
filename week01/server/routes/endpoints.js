import express from 'express';
import endpointController from '../controller/endpointController.js';
const router = new express.Router();


router.get('/', endpointController.getData);
router.get('/:id', endpointController.getDataById);


export default router;