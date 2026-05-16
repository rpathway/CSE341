import express from 'express';
import endpointController from '../controller/endpointController.js';
const router = new express.Router();


router.get('/', endpointController.getData);
router.get('/:id', endpointController.getDataById);
router.post('/', endpointController.createUser);
router.put('/:id', endpointController.updateUser);
router.delete('/:id', endpointController.deleteUser);


export default router;