import config from '../Config/env';
import { getItem } from "./storage";
// import './download';

export function get(url, containUserInfo = true) {
    let headers;
    if(containUserInfo) {
        const auth = getItem("token");
        headers = {
            auth,

            'Content-Type': 'application/json'
        }
    } else {
        headers = {
            'Content-Type': 'application/json'
        }
    }
    const result = fetch(config.url + url, {
        headers,
        method: "GET"
    }).then(function (response) {
        return response.json();
    });
    return result;
}

export function post(url, json, containUserInfo = true) {
    let headers;
    if(containUserInfo) {
        const auth = getItem("token");
        headers = {
            auth,

            'Content-Type': 'application/json'
        }
    } else {
        headers = {
            'Content-Type': 'application/json'
        }
    }
    const result = fetch(config.url + url, {
        method: 'POST',
        headers,
        body: JSON.stringify(json)
    }).then(function (response) {
        return response.json();
    });

    return result;
}

export function file(data, path) {
    const option ={
        method: 'post',
        headers: {
            'auth': getItem("token"),
        },
        body:data
    };
    const result = fetch(config.url + 'user/'+ path +'/upload', option).then(function (response) {
        return response.json();
    });

    return result;
}

export function downloadFile(url, filename) {
    fetch(config.url + url, {
        method: 'GET',
        headers: {
            'auth': getItem("token"),
        },
    }).then(function(resp) {
        return resp.blob();
    }).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    });
}