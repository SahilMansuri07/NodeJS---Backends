import Joi from "joi";

const cartManageSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  size_id: Joi.number().integer().allow(null),
  color_id: Joi.number().integer().allow(null),
  type_id: Joi.number().integer().allow(null),
  quantity: Joi.number().integer().min(0).required(),
});

const cartRemoveSchema = Joi.object({
  variant_id: Joi.number().integer().positive(),
  product_id: Joi.number().integer().positive(),
  quantity: Joi.number().integer().min(0),
}).or("variant_id", "product_id");

const addPaymentMethodSchema = Joi.object({
  holder_name: Joi.string().trim().allow("", null),
  card_number: Joi.string().trim().required(),
  expiry_date: Joi.string().trim().allow("", null),
  payment_mode: Joi.string().trim().required(),
  upi_id: Joi.string().trim().allow("", null),
  cvv: Joi.string().trim().allow("", null),
});

const placeOrderSchema = Joi.object({
  user_latitude: Joi.string().trim().allow("", null),
  user_longitude: Joi.string().trim().allow("", null),
  user_location: Joi.string().trim().allow("", null),
  subtotal: Joi.number(),
  tax: Joi.number(),
  discount: Joi.number(),
  total: Joi.number(),
  payment_mode: Joi.string().trim().allow("", null),
  payment_card_name: Joi.string().trim().allow("", null),  payment_card_numer: Joi.string().trim().allow("", null),
  payment_card_number: Joi.string().trim().allow("", null),
  payment_id: Joi.number().integer().allow(null),
});

const favouriteSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
});

const addRatingSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  rating: Joi.number().precision(10, 2).min(1).max(5).required(),
  review: Joi.string().trim().allow("", null),
});

const cancelOrderSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
});

const setAddressSchema = Joi.object({
  address_id: Joi.number().integer().positive().required(),
});

const updateAddressSchema = Joi.object({
  address_id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  address_line_1: Joi.string().trim().required(),
  address_line_2: Joi.string().trim().allow("", null),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  postal_code: Joi.string().trim().required(),
  latitude: Joi.string().trim().allow("", null),
  longitude: Joi.string().trim().allow("", null),
});

const deleteAddressSchema = Joi.object({
  address_id: Joi.number().integer().positive().required(),
});

const contactUsSchema = Joi.object({
  title: Joi.string().trim().max(64).required(),
  email: Joi.string().trim().email().max(256).required(),
  message: Joi.string().trim().max(128).required(),
});

const voucherRedeemSchema = Joi.object({
  voucher_code: Joi.string().trim().max(50).required(),
});

export default {
  cartManageSchema,
  cartRemoveSchema, 
    addPaymentMethodSchema, 
    placeOrderSchema,
    favouriteSchema,
    addRatingSchema,
    cancelOrderSchema,
    setAddressSchema,
    updateAddressSchema,
    deleteAddressSchema,
    contactUsSchema,
    voucherRedeemSchema,
};
