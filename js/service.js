const API = `https://634e9f834af5fdff3a625f84.mockapi.io`;

export const getList = path => fetch(API + path).then(data => data.json());

export const addItem = (path, obj) => fetch(API + path, {
    method: `POST`,
    headers: {
        "Content-type": "application/json"
    },
    body: JSON.stringify(obj)
}).then(data => data.json());

export const changeItem = (path, obj) => fetch(API + path, {
    method: `PUT`,
    headers: {
        "Content-type": "application/json"
    },
    body: JSON.stringify(obj)
}).then(data => data.json());

export const deleteItem = (path) => fetch(API + path, { method: `DELETE` }).then(data => data.json());

