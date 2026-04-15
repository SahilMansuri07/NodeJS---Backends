import authModule from "../module/authModule.js";


const authController = {
    async addUserAddress(request, res) {
        request = request.body;
        return authModule.addUserAddress(request, res);
    },

    async validateUser(request, res) {
        request = request.body;
        return authModule.validateUser(request, res);
    },
    async login(request, res) {
        request = request.body;
        return authModule.login(request, res);
    },
    async requestOtp(request, res) {
        request = request.body;
        return authModule.requestOtp(request, res);
    },
    async verifyOtp(request, res) {
        request = request.body;
        return authModule.verifyOtp(request, res);
    },
    async resendOtp(request, res) {
        request = request.body;
        return authModule.resendOtp(request, res);
    } ,
    async forgetPassword(request, res) {
        request = request.body;
        return authModule.forgetPassword(request, res);
    } ,
    async verifyForgetPasswordOtp(request, res) {
        request = request.body;
        return authModule.verifyForgetPasswordOtp(request, res);
    },
    async resetPassword(request, res) {
        request = request.body;
        return authModule.resetPassword(request, res);
    },
    async updateProfile(request, res) {
        request = request.body;
        return authModule.updateProfile(request, res);
    },
    async logout(request, res) {
        return authModule.logout(request, res);
    },
    async setProfile(request, res) {
        return authModule.setProfile(request, res);
    },
    async setLanguage(request, res) {
        return authModule.setLanguage(request, res);
    },
    async changePassword(request, res) {
        return authModule.changePassword(request, res);
    }
}

export default authController;