import { renderHeader } from "./header.js";
import { logInUser } from "./logInUser.js";
import { getList, changeItem } from "./service.js";

renderHeader();

const userInfoName = document.querySelector(`#userInfoName`);
const userInfoEmail = document.querySelector(`#userInfoEmail`);
userInfoName.innerHTML = logInUser.name;
userInfoEmail.innerHTML = logInUser.email;

const deleteAcc = document.querySelector(`#deleteAcc`);

deleteAcc.addEventListener(`click`, async () => {
    await changeItem(`/users/${logInUser.id}`, { status: false });
    localStorage.removeItem(`user`);
    document.location.href = `index.html`;
})

const renderOrderTable = async (user) => {
    let ploducts = await getList(`/products`);

    console.log(user)
    let TRs = user.orders
        .map(order => {
            let product = ploducts.find(item => item.id === order.id);
            console.log(product);

            let productSale = product.sale ? `<span class="item__sale">-${product.salePercent}%</span>` : `-`;

            let sumOfProduct = product.price * order.count;
            if (product.sale) sumOfProduct -= product.price * product.salePercent / 100;

            return `<tr><td>
                    <div class="item__info">
                        <img src="images/products/${product.img}.png" alt="${product.title}" height="100" />
                        <div>
                            <p class="item__info--title">${product.title}</p>
                        </div>
                    </div>
                    </td>
                    <td>${product.price}</td>
                    <td><span class="item__sale">${productSale}</span></td>
                    <td>${order.count}</td>
                    <td>$${sumOfProduct}</td></tr>`
        })
        .join(``);

    document.querySelector(`tbody`).innerHTML = TRs;
}

renderOrderTable(logInUser)