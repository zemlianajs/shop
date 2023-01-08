export const errorFunc = (form, text) => {
    let error = form.querySelector(`.error`);
    error.innerHTML = text;
    error.classList.add(`active`);
}