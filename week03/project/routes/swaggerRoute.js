import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger.json' with { type: 'json' };


const router = new express.Router();


router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));


export default router;
