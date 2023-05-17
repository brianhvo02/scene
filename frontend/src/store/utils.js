import { useDispatch } from "react-redux";

const getCookie = cookieName => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === cookieName) return value;
    }
    return null;
}

export const customFetch = async (url, options = {}) => {
    options.method = options.method || "GET";
    options.headers = options.headers || {};
    const jwtToken = sessionStorage.getItem("jwtToken");

    if (jwtToken) options.headers["Authorization"] = 'Bearer ' + jwtToken;

    if (options.method.toUpperCase() !== "GET") {
        if (options.headers["Content-Type"] !== null) {
            options.headers["Content-Type"] = 
                options.headers["Content-Type"] || "application/json";
        } else delete options.headers["Content-Type"];
        options.headers["X-CSRF-Token"] = getCookie("X-CSRF-Token");
    }

    const res = await fetch(url, options);
    if (res.status >= 400) throw res;
    return res.json();
}

export const fetchUrl = (url, action, options) => dispatch => customFetch(url, options).then(json => dispatch(action(json)) && json);