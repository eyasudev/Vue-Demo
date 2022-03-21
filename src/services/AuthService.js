import axios from 'axios';
const url = 'http://122.179.134.51:4093/api/';
export default {
    login(credentials) {
        return axios
            .post(url + 'login_check', credentials)
            .then(response => response.data)
            .catch(error => error);
    },
    signUp(credentials) {
        return axios
            .post(url + 'sign-up/', credentials)
            .then(response => response.data);
    }
};