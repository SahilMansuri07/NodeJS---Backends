import express from "express";
import Joi from "joi";
import userController from "../controllers/userControllers.js";
import middleware from "../../../../middleware/middleware.js";

const userRoutes = express.Router();

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
  payment_card_name: Joi.string().trim().allow("", null),
  payment_card_numer: Joi.string().trim().allow("", null),
  payment_card_number: Joi.string().trim().allow("", null),
  payment_id: Joi.number().integer().allow(null),
});

const favouriteSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
});

const addRatingSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
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

userRoutes.get("/home", userController.home);
userRoutes.get("/products", userController.products);
userRoutes.get("/products-filter", userController.filterProducts);
userRoutes.get("/category-listing", userController.categoryListing);
userRoutes.get("/product-details", userController.productDetails);
userRoutes.get("/product-reviews", userController.productReviews);
userRoutes.get("/store-listing", userController.getStoreListing);
userRoutes.get("/store-data", userController.fetchStoreData);
userRoutes.get("/cart/details", userController.cartDetails);
userRoutes.post("/cart/add", middleware.validateJoi(cartManageSchema), userController.addToCart);
userRoutes.post("/cart/remove", middleware.validateJoi(cartRemoveSchema), userController.removeFromCart);
userRoutes.post(
  "/payment-method/add",
  middleware.validateJoi(addPaymentMethodSchema),
  userController.addPaymentMethod,
);
userRoutes.post("/place-order", middleware.validateJoi(placeOrderSchema, true), userController.placeOrderFromCart);
userRoutes.get("/order-history", userController.orderHistory);
userRoutes.get("/order-details", userController.orderDetails);
userRoutes.post("/favourite/add-remove", middleware.validateJoi(favouriteSchema), userController.addRemoveFavourites);
userRoutes.get("/favourite/list", userController.favouriteListing);
userRoutes.post("/rating/add", middleware.validateJoi(addRatingSchema), userController.addRating);
userRoutes.get("/notifications", userController.getNotifications);
userRoutes.put("/cancel-order", middleware.validateJoi(cancelOrderSchema), userController.cancelOrder);
userRoutes.get("/address/list", userController.listAddresses);
userRoutes.post("/address/set", middleware.validateJoi(setAddressSchema), userController.setAddress);
userRoutes.put("/address/update", middleware.validateJoi(updateAddressSchema), userController.updateAddress);
userRoutes.delete("/address/delete", middleware.validateJoi(deleteAddressSchema), userController.deleteAddress);

export default userRoutes;
