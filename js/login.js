import { errorFunc } from "./errorFunc.js";
import { getList, changeItem, addItem } from "./service.js";
import { renderHeader } from "./header.js";

renderHeader();

const loginForm = document.querySelector(`#loginForm`);
const registrationForm = document.querySelector(`#registrationForm`);

loginForm.addEventListener(`submit`, async e => {
    e.preventDefault();

    let email = e.target.querySelector(`input[data-name="email"]`).value;
    let password = e.target.querySelector(`input[data-name="password"]`).value;

    let usersExists = await getList(`/users`);
    let userExist = usersExists.find(user => user.email === email);

    if (!userExist) {
        errorFunc(e.target, `Invalid email address`)
    } else if (userExist.password !== password) {
        errorFunc(e.target, `Invalid password`)
    } else {
        let loggedUser = await changeItem(`/users/${userExist.id}`, { status: true });
        document.location.href = `index.html`;
        localStorage.setItem(`user`, JSON.stringify(loggedUser));
    }
})

registrationForm.addEventListener(`submit`, async e => {
    e.preventDefault();

    let name = e.target.querySelector(`input[data-name="name"]`).value;
    let email = e.target.querySelector(`input[data-name="email"]`).value;
    let password = e.target.querySelector(`input[data-name="password"]`).value;
    let passwordVerify = e.target.querySelector(`input[data-name="passwordVerify"]`).value;

    let usersExists = await getList(`/users`);
    let userExist = usersExists.find(user => user.email === email);

    if (password !== passwordVerify) {
        errorFunc(e.target, `Password not matches!`)
    } else if (userExist) {
        errorFunc(e.target, `User with email ${userExist.email} already exist!`)
    } else {
        let newUser = {
            name: name,
            email: email,
            password: password,
            status: true,
        }
        let addNewUser = await addItem(`/users`, newUser);
        localStorage.setItem(`user`, JSON.stringify(addNewUser));
        document.location.href = `index.html`;
    }
})

