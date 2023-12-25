import { Router } from "express";
import * as userCtrl from "../controllers/userCtrl.js";
import auth from "../middlewares/Auth.js";
const router = Router();
router.route("/").post(userCtrl.register);
router.route("/auth").post(userCtrl.auth);
router.route("/logout").post(userCtrl.logOut);
router
  .route("/profile")
  .get(auth, userCtrl.getUserProfile)
  .put(auth, userCtrl.updateUserProfile)
  .delete(auth, userCtrl.deleteUserProfile);
export default router;
