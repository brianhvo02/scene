import { Router } from 'express';
const router = Router();

import { isProduction } from '../config';

if (!isProduction) {
    router.get("/restore", (req, res) => {
        const csrfToken = req.csrfToken();
        res.cookie("X-CSRF-Token", csrfToken);
        res.status(200).json({
            'X-CSRF-Token': csrfToken
        });
    });
}

export default router;