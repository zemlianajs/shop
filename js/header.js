import { changeItem } from "./service.js";
import { logInUser } from "./logInUser.js";

const headerUser = document.querySelector(`#headerUser`);
const headerShoppingCart = document.querySelector(`#headerShoppingCart`);
export const headerShoppingCartCount = document.querySelector(`#headerShoppingCartCount`);
const headerLogout = document.querySelector(`#headerLogout`);

export const renderHeader = () => {
    if (logInUser) {
        headerUser.href = `account.html`;
        headerUser.innerHTML = logInUser.name;

        headerShoppingCart.href = `shoppingCart.html`;
        headerShoppingCartCount.innerHTML = logInUser.shoppingCart.length;

        headerLogout.classList.add(`active`);
        headerLogout.addEventListener(`click`, async () => {
            await changeItem(`/users/${logInUser.id}`, { status: false });
            localStorage.removeItem(`user`);
            document.location.href = `index.html`;
        })
    } else {
        headerShoppingCart.href = `login.html`;
        headerUser.href = `login.html`;
    }
};
renderHeader();