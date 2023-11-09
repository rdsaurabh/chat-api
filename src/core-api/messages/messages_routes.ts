import express from 'express';

import { authenticateJwt } from '../auth/jwtauth_middleware';
import { getMessages } from './messages_controller';

const router = express.Router();
router.use(authenticateJwt);


router.get("/",getMessages);


export default router;