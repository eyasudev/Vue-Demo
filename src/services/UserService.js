import axios from 'axios';
const url = 'http://api.vue.local:4093/api/';
export default {
    getAll(params, token) {
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        };

        return axios
            .post(url + 'users', { params }, {
                headers
            })
            .then(response => response);
    },
    get(id, token) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        };
        const params = {
            'user_id': id,
        }
        return axios
            .post(url + 'edit', { params }, {
                headers
            })
            .then(response => response);
    },
    create(data, token) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
        };
        return axios
            .post(url + 'register', data, { headers })
            .then(response => response);
    },
    updateFile(data, token) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
        };
        return axios
            .post(url + 'uploadFile', data, { headers })
            .then(response => response);
    },
    update(data, token) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        };
        return axios
            .post(url + 'update', data, { headers })
            .then(response => response);
    },
    delete(id) {
        return axios
            .delete(url + `users/${id}`)
            .then(response => response);
    },
    deleteAll() {
        return axios
            .put(url + `users/`)
            .then(response => response);
    }
};