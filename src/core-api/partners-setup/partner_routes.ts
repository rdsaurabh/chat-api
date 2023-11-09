import express from 'express';
import { getPartners,addPartner } from './partner_controller';
import { authenticateJwt } from '../auth/jwtauth_middleware';

const router = express.Router();
router.use(authenticateJwt);


router.get("/",getPartners);
router.post("/",addPartner);

export default router;