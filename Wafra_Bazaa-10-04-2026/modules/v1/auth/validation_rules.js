import Joi from "joi"; 

const loginSchema = Joi.object({
  email: Joi.string().email().trim(),
  country_code: Joi.string().trim(),
  mobile_number: Joi.string().trim(),
  password: Joi.string().trim(),
  social_id: Joi.string().trim(),
  login_type: Joi.string().valid("G", "A", "F", "S"),
}).or("email", "social_id", "mobile_number");

const addAddressSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  company_name: Joi.string().allow(null, ""),
  address_line_1: Joi.string().trim().required(),
  address_line_2: Joi.string().allow(null, ""),
  latitude: Joi.string().allow(null, ""),
  longitude: Joi.string().allow(null, ""),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  postal_code: Joi.string().trim().required(),
  is_default: Joi.number().integer().valid(0, 1),
});

const validateUserSchema = Joi.object({
  email: Joi.string().email().trim(),
  mobile_number: Joi.string().trim(),
  country_code: Joi.string().trim(),
  social_id: Joi.string().trim(),
  login_type: Joi.string().valid("G", "A", "F", "S"),
  name: Joi.string().trim(),
})
  .or("email", "mobile_number", "social_id")
  .with("mobile_number", "country_code")
  .with("country_code", "mobile_number")
  .with("social_id", "login_type");

const requestOtpSchema = Joi.object({
  email: Joi.string().email().trim(),
  country_code: Joi.string().trim(),
  mobile_number: Joi.string().trim(),
  type: Joi.string().trim(),
  otp_purpose: Joi.string().trim(),
})
  .or("email", "mobile_number")
  .with("mobile_number", "country_code")
  .with("country_code", "mobile_number");

const verifyOtpSchema = Joi.object({
  otp: Joi.number().integer().required(),
  email: Joi.string().email().trim(),
  country_code: Joi.string().trim(),
  mobile_number: Joi.string().trim(),
  name: Joi.string().trim(),
  password: Joi.string().trim(),
  login_type: Joi.string().valid("G", "A", "F", "S"),
  language: Joi.string().trim(),
})
  .or("email", "mobile_number")
  .with("mobile_number", "country_code")
  .with("country_code", "mobile_number");

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

const verifyForgetPasswordOtpSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  otp: Joi.number().integer().required(),
  new_password: Joi.string().trim(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  new_password: Joi.string().trim().required(),
});

const updateProfileSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  profile_image: Joi.string().trim().allow(null, ""),
  is_skip: Joi.number().integer().valid(0, 1),
});

const setProfileSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  country_code: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  profile_image: Joi.string().trim().allow(null, ""),
});

const setLanguageSchema = Joi.object({
  language: Joi.string().trim().required(),
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().trim().required(),
  new_password: Joi.string().trim().required(),
});

export default {
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
    changePasswordSchema,
}
