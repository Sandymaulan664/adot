import axios from 'axios';

let url = 'http://localhost:10050'

export default axios.create({
    baseURL: url,
    headers: {
        // Authorization: localStorage.getItem('tokenMtg') !== 'null' ? 'Bearer ' + localStorage.getItem('tokenMtg') : '',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        //'X-API-Key': abcdefgh123456789,
        // 'user_key': '6ab0c0c4f7c40f3c7747329890cc5e78',
        // 'user_key':'6ab0c0c4f7c40f3c7747329890cc5e78',
        // 'Content-Type': 'application/json',
    },
    responseType: 'json'
});