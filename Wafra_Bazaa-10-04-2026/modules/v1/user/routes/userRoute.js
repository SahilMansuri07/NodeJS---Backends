import express from "express";

import userController from "../controllers/userControllers.js";
import middleware from "../../../../middleware/middleware.js";
import  schema from "../validation_rules.js";

const {
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
} = schema;

const userRoutes = express.Router();


userRoutes.get("/home", userController.home);
userRoutes.get("/products", userController.products); 
userRoutes.get("/products-filter", userController.filterProducts);
userRoutes.get("/category-listing", userController.categoryListing);
userRoutes.get("/faq-listing", userController.faqListing);
userRoutes.get("/product-details", userController.productDetails);
userRoutes.get("/product-reviews", userController.productReviews);
userRoutes.get("/store-listing", userController.getStoreListing);
userRoutes.get("/store-data", userController.fetchStoreData);
userRoutes.get("/cart/details", userController.cartDetails); 
userRoutes.post("/cart/add", middleware.validateJoi(cartManageSchema), userController.addToCart);
userRoutes.post("/cart/remove", middleware.validateJoi(cartRemoveSchema), userController.removeFromCart);
userRoutes.post("/payment-method/add", middleware.validateJoi(addPaymentMethodSchema), userController.addPaymentMethod );
userRoutes.post("/voucher/redeem", middleware.validateJoi(voucherRedeemSchema), userController.redeemVoucher);
userRoutes.post("/place-order", middleware.validateJoi(placeOrderSchema, true), userController.placeOrderFromCart);
userRoutes.get("/order-history", userController.orderHistory);
userRoutes.get("/order-details", userController.orderDetails);
userRoutes.get("/order-summary", userController.orderSummary);
userRoutes.post("/favourite/add-remove", middleware.validateJoi(favouriteSchema), userController.addRemoveFavourites);
userRoutes.get("/favourite/list", userController.favouriteListing);
userRoutes.post("/rating/add", middleware.validateJoi(addRatingSchema), userController.addRating);
userRoutes.get("/notifications", userController.getNotifications);
userRoutes.put("/cancel-order", middleware.validateJoi(cancelOrderSchema), userController.cancelOrder);
userRoutes.get("/address/list", userController.listAddresses);
userRoutes.post("/address/set", middleware.validateJoi(setAddressSchema), userController.setAddress);
userRoutes.put("/address/update", middleware.validateJoi(updateAddressSchema), userController.updateAddress);
userRoutes.delete("/address/delete", middleware.validateJoi(deleteAddressSchema), userController.deleteAddress);
userRoutes.post("/contact-us", middleware.validateJoi(contactUsSchema), userController.contactUs);

export default userRoutes;
