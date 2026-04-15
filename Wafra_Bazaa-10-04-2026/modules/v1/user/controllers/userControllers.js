import userModule from "../module/userModule.js";

const userController = {
    /**
     * Homepage endpoint - Fetches all homepage sections
     * GET /home
     */
    async home(request, res) {
        return userModule.home(request, res);
    },

    /**
     * Products search endpoint - Fetches products with search & category filter
     * GET /products?search=...&category_id=...&page=...&limit=...
     */
    async products(request, res) {
        return userModule.products(request, res);
    },

    async filterProducts(request, res) {
        return userModule.filterProducts(request, res);
    },

    async categoryListing(request, res) {
        return userModule.categoryListing(request, res);
    },

    async productDetails(request, res) {
        return userModule.productDetails(request, res);
    },

    async productReviews(request, res) {
        return userModule.productReviews(request, res);
    },
    async getStoreListing(request, res) {
        return userModule.getStoreListing(request, res);
    },

    async fetchStoreData(request, res) {
        return userModule.fetchStoreData(request, res);
    },

    async addToCart(request, res) {
        return userModule.manageCart(request, res);
    },

    async cartDetails(request, res) {
        return userModule.cartDetails(request, res);
    },

    async removeFromCart(request, res) {
        return userModule.removeFromCart(request, res);
    },

    async addPaymentMethod(request, res) {
        return userModule.addPaymentMethod(request, res);
    },

    async placeOrderFromCart(request, res) {
        return userModule.placeOrderFromCart(request, res);
    },

    async orderHistory(request, res) {
        return userModule.orderHistory(request, res);
    },

    async orderDetails(request, res) {
        return userModule.orderDetails(request, res);
    },

    async addRemoveFavourites(request, res) {
        return userModule.addRemoveFavourites(request, res);
    },

    async favouriteListing(request, res) {
        return userModule.favouriteListing(request, res);
    },

     async addRating(request, res) {
        return userModule.addRating(request, res);
    },

    async getNotifications(request, res) {
        return userModule.getNotifications(request, res);
    },

    async listAddresses(request, res) {
        return userModule.listAddresses(request, res);
    },
    
    async setAddress(request, res) {
        return userModule.setAddress(request, res);
    },

    async updateAddress(request, res) {
        return userModule.updateAddress(request, res);
    },

    async deleteAddress(request, res) {
        return userModule.deleteAddress(request, res);
    },
     async cancelOrder(request, res) {
        return userModule.cancelOrder(request, res);
    }
};

export default userController;