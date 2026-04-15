import express from "express";
import authController from "../controllers/authControllers.js";
import middleware from "../../../../middleware/middleware.js";
import schemas from "../validation_rules.js";

const {
  loginSchema,
  addAddressSchema,
  validateUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
  forgetPasswordSchema,
  verifyForgetPasswordOtpSchema,
  resetPasswordSchema,
  updateProfileSchema,
  setProfileSchema,
  setLanguageSchema,
  changePasswordSchema
} = schemas;

const authRoutes = express.Router();


authRoutes.post("/login", middleware.validateJoi(loginSchema), authController.login);
authRoutes.post("/add-address", middleware.validateJoi(addAddressSchema), authController.addUserAddress);
authRoutes.post("/validate-user", middleware.validateJoi(validateUserSchema), authController.validateUser);
authRoutes.post("/request-otp", middleware.validateJoi(requestOtpSchema), authController.requestOtp);
authRoutes.post("/verify-otp", middleware.validateJoi(verifyOtpSchema), authController.verifyOtp);
authRoutes.post("/resend-otp", middleware.validateJoi(requestOtpSchema), authController.resendOtp);
authRoutes.post("/forget-password", middleware.validateJoi(forgetPasswordSchema), authController.forgetPassword);
authRoutes.post("/verify-forget-password-otp", middleware.validateJoi(verifyForgetPasswordOtpSchema), authController.verifyForgetPasswordOtp);
authRoutes.put("/reset-password", middleware.validateJoi(resetPasswordSchema), authController.resetPassword);
authRoutes.put("/update-profile", middleware.validateJoi(updateProfileSchema), authController.updateProfile);
authRoutes.delete("/logout", authController.logout);
authRoutes.put("/set-profile", middleware.validateJoi(setProfileSchema), authController.setProfile);
authRoutes.put("/set-language", middleware.validateJoi(setLanguageSchema), authController.setLanguage);
authRoutes.put("/change-password", middleware.validateJoi(changePasswordSchema), authController.changePassword);

export default authRoutes;
