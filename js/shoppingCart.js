import { renderHeader, headerShoppingCartCount } from "./header.js";
import { logInUser } from "./logInUser.js";
import { getList, changeItem } from "./service.js";

renderHeader()

const orderSummary = document.querySelector(`#orderSummary`);
const orderSummaryTotal = document.querySelector(`#orderSummaryTotal`);
const shoppingCartTable = document.querySelector(`#shoppingCartTable tbody`);
let totalPrice = [];

const renderShoppingCartItem = (item) => {

    const tr = document.createElement(`tr`);

    const tdItem = document.createElement(`td`);
    tdItem.innerHTML = `<div class="item__info">
        <img src="images/products/${item.img}.png" alt="${item.title}" height="100" />
        <div>
            <p class="item__info--title">${item.title}</p>
        </div>
        </div>`;

    const tdPrice = document.createElement(`td`);
    tdPrice.innerHTML = `$${item.price}`;

    const tdSale = document.createElement(`td`);
    tdSale.innerHTML = item.sale
        ? `<td><span class="item__sale">- ${item.salePercent}%</span></td>`
        : `-`;

    const tdTotal = document.createElement(`td`);
    let priceOfItem = item.sale
        ? (item.price - (item.price * (item.salePercent / 100))) * item.count
        : item.price * item.count;
    tdTotal.innerHTML = `$${priceOfItem}`;

    totalPrice.push(priceOfItem);
    orderSummaryTotal.innerHTML = `$${totalPrice.reduce((a, b) => { return a + b; })}`

    const tdQuantity = document.createElement(`td`);
    const quantitytInput = document.createElement(`input`);
    quantitytInput.type = `number`;
    quantitytInput.min = 1;
    quantitytInput.max = 999;
    quantitytInput.value = item.count;

    quantitytInput.addEventListener(`change`, async e => {
        totalPrice.splice(totalPrice.indexOf(priceOfItem), 1);
        let productsInShoppingCart = logInUser.shoppingCart.findIndex(el => el.id == item.id);

        logInUser.shoppingCart[productsInShoppingCart].count = +e.target.value;
        await changeItem(`/users/${logInUser.id}`, { shoppingCart: logInUser.shoppingCart });
        localStorage.setItem(`user`, JSON.stringify(logInUser));

        let changePriceOfItem = item.sale
            ? (item.price - (item.price * (item.salePercent / 100))) * e.target.value
            : item.price * e.target.value;

        tdTotal.innerHTML = `$${changePriceOfItem}`
        totalPrice.push(changePriceOfItem);
        orderSummaryTotal.innerHTML = `$${totalPrice.reduce((a, b) => { return a + b; })}`
    })
    tdQuantity.append(quantitytInput);

    const tdDel = document.createElement(`td`);
    const btnDel = document.createElement(`button`);
    btnDel.className = `item__remove`;
    btnDel.innerHTML = '<img src="images/delete.png" alt="delete" height="20"/>';

    btnDel.addEventListener(`click`, async () => {
        const productIndex = logInUser.shoppingCart.findIndex(product => product.id == item.id);
        logInUser.shoppingCart.splice(productIndex, 1);
        await changeItem(`/users/${logInUser.id}`, { shoppingCart: logInUser.shoppingCart });
        localStorage.setItem(`user`, JSON.stringify(logInUser));
        tr.remove();

        headerShoppingCartCount.innerHTML = logInUser.shoppingCart.length;
        totalPrice.splice(totalPrice.indexOf(priceOfItem), 1);
        orderSummaryTotal.innerHTML = `$${totalPrice.reduce((a, b) => { return a + b; })}`
    })

    tdDel.append(btnDel);
    tr.append(tdItem, tdPrice, tdSale, tdQuantity, tdTotal, tdDel);
    shoppingCartTable.append(tr);
}

(async () => {
    let products = await getList(`/products`);
    const productsInShoppingCart = logInUser.shoppingCart
        .reduce((list, item) => {
            let product = products.find(product => product.id == item.id);
            product.count = item.count;
            list.push(product);
            return list;
        }, []);

    productsInShoppingCart.forEach(item => renderShoppingCartItem(item));
})();

orderSummary.addEventListener(`submit`, async (e) => {
    e.preventDefault();

    logInUser.orders = logInUser.orders.concat(logInUser.shoppingCart);
    logInUser.shoppingCart = [];

    await changeItem(`/users/${logInUser.id}`, logInUser);
    localStorage.setItem(`user`, JSON.stringify(logInUser));
    document.location.href = `account.html`;
})
