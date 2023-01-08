import { renderHeader, headerShoppingCartCount } from "./header.js";
import { logInUser } from "./logInUser.js";
import { getList, changeItem } from "./service.js";

renderHeader();

const categoriesContainer = document.querySelector(`#categoriesContainer`);

const createSection = (item) => {
    const category = document.createElement(`section`);
    category.className = `category`;
    category.setAttribute(`data-name`, `${item}`);

    const categoryTitle = document.createElement(`h2`);
    categoryTitle.innerHTML = `${item}`;

    const categoryContainer = document.createElement(`div`);
    categoryContainer.className = `category__container`;

    categoriesContainer.append(category);
    category.append(categoryTitle);
    category.append(categoryContainer);

    return document.querySelector(`section[data-name=${item}]`)
}

const createProducts = (data) => {

    const sectionOfCategory = document.querySelector(`section[data-name=${data.category}]`)
        ? document.querySelector(`section[data-name=${data.category}]`)
        : createSection(data.category);

    const categoryContainer = sectionOfCategory.querySelector(`.category__container`);

    //product
    const product = document.createElement(`div`);
    product.className = `product`;
    product.setAttribute(`data-id`, `${data.id}`);

    //product__img
    const productImg = document.createElement(`img`);
    productImg.className = `product__img`;
    productImg.setAttribute(`src`, `images/products/${data.img}.png`);
    productImg.setAttribute(`alt`, `${data.title}`);
    productImg.setAttribute(`height`, `80`);

    //product__title
    const productTitle = document.createElement(`p`);
    productTitle.className = `product__title`;
    productTitle.innerHTML = `${data.title}`

    //product__sale
    if (data.sale) {
        const productSale = document.createElement(`div`);
        productSale.className = `product__sale`;

        const productSaleOld = document.createElement(`span`);
        productSaleOld.className = `product__sale--old`;
        productSaleOld.innerHTML = `$${data.price}`;

        const productSalePercent = document.createElement(`span`);
        productSalePercent.className = `product__sale--percent`;
        productSalePercent.innerHTML = `-${data.salePercent}%`;

        product.append(productSale);
        productSale.append(productSaleOld);
        productSale.append(productSalePercent);
    }

    //product__info
    const productInfo = document.createElement(`div`);
    productInfo.className = `product__info`;

    //product__price
    const productPrice = document.createElement(`span`);
    productPrice.className = `product__price`;
    productPrice.innerHTML = data.sale ? `$${data.price - (data.price * (data.salePercent / 100))}` : `$${data.price}`;

    //product__cart
    const BtnProductCart = document.createElement(`button`);
    BtnProductCart.className = `product__cart`;
    BtnProductCart.setAttribute(`data-id`, `${data.id}`);
    BtnProductCart.innerHTML = `<img src="images/shopping-cart.png" alt="shopping cart" height="20">`;

    categoryContainer.append(product);
    product.append(productImg);
    product.append(productTitle);
    product.append(productInfo);
    productInfo.append(productPrice);
    productInfo.append(BtnProductCart);

}

const userProducts = () => {
    let btnsProductCart = document.querySelectorAll(`.product__cart`);
    btnsProductCart.forEach(btn => {
        let IDproduct = btn.dataset.id;

        let userProductIndex = logInUser.shoppingCart.findIndex(product => product.id == IDproduct);
        if (userProductIndex > -1) btn.classList.add(`product__cart--in`);

        btn.addEventListener(`click`, async e => {
            e.preventDefault();

            userProductIndex = logInUser.shoppingCart.findIndex(product => product.id == IDproduct);

            if (userProductIndex === -1) {
                logInUser.shoppingCart.push({ id: IDproduct, count: 1 });
                btn.classList.add(`product__cart--in`);
            } else {
                logInUser.shoppingCart.splice(userProductIndex, 1);
                btn.classList.remove(`product__cart--in`);
            }

            headerShoppingCartCount.innerHTML = logInUser.shoppingCart.length;

            await changeItem(`/users/${logInUser.id}`, { shoppingCart: logInUser.shoppingCart });
            localStorage.setItem(`user`, JSON.stringify(logInUser));
        })
    })
}

const renderProducts = async () => {
    let products = await getList(`/products`);
    products.forEach(item => createProducts(item));
    logInUser && userProducts();
}

renderProducts();

