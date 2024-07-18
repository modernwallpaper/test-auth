import express from "express";
import { 
  login,
  register,
  logout,
  profile,
  update,
} from "../controller/controller.js";
import { protect } from "../middleware/auth.midlleware.js";

const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/logout', logout);
router.route('/users/profile').get(protect, profile).put(protect, update);

export default router;
