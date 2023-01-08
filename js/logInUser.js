export const logInUser = localStorage.getItem(`user`)
    ? JSON.parse(localStorage.getItem(`user`))
    : null;