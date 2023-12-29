import express from 'express';
import userauth from '../middleware/userauth.js';
import { logincontroller, productcontroller, refreshcontroller, registercontroller, usercontroller } from '../controller/index.js';
import admincontroller from '../middleware/admin.js';
const router = express.Router();

router.post('/register', registercontroller.register);
router.post('/login', logincontroller.login);
router.post('/user', userauth, usercontroller.me);
router.post('/refresh', refreshcontroller.refresh);
router.post('/logout', logincontroller.logout);
router.post('/insert', [userauth, admincontroller], productcontroller.store);
router.put('/update/:id', [userauth, admincontroller], productcontroller.update);
router.delete('/delete/:id', [userauth, admincontroller], productcontroller.delete);
router.get('/show', productcontroller.show)

export default router;