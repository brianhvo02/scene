function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === cookieName) return value;
    }
    return null;
}

async function jwtFetch(url, options = {}) {
    options.method = options.method || "GET";
    options.headers = options.headers || {};
    const jwtToken = sessionStorage.getItem("jwtToken");

    if (jwtToken) options.headers["Authorization"] = 'Bearer ' + jwtToken;

    if (options.method.toUpperCase() !== "GET") {
        options.headers["Content-Type"] =
            options.headers["Content-Type"] || "application/json";
        options.headers["X-CSRF-Token"] = getCookie("X-CSRF-Token");
    }

    const res = await fetch(url, options);
    if (res.status >= 400) throw res;
    return res;
}

export default jwtFetch;