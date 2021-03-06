import { authHeader } from '../helpers';

function register(user, registerToast) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch('http://flowrspot-api.herokuapp.com/api/v1/users/register', requestOptions).then(handleResponse).then(result => {
        registerToast();
    }
    );
}

function logout() {
    localStorage.removeItem('user');
}

function getUser() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('http://flowrspot-api.herokuapp.com/api/v1/users/me', requestOptions).then(handleResponse);
}

async function login(user, loginToast) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return await fetch('http://flowrspot-api.herokuapp.com/api/v1/users/login', requestOptions)
        .then(handleResponse)
        .then(value => {
            localStorage.setItem('user', JSON.stringify(value));
            loginToast();
            return user;
        });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
            }

            const error = (data && data.message) || response.statusText;
            console.log(error)
            return Promise.reject(error);
        }
        return data;
    }, error => {
        console.log(error)
    });
}

export const userService = {
    register,
    logout,
    login,
    getUser
};
