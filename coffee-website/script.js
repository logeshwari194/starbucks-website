/* =====================================================
   STARBUCKS PREMIUM COFFEE WEBSITE
   ===================================================== */


/* ================= GLOBAL VARIABLES ================= */

let cart = [];

let toastTimer;


/* ================= PRELOADER ================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        document
            .getElementById("preloader")
            .classList.add("hide");

    }, 900);

    startCounters();

    revealOnScroll();

});


/* ================= SCROLL ANIMATION ================= */

function revealOnScroll() {

    const elements =
        document.querySelectorAll(".reveal");


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target
                            .classList
                            .add("visible");

                        observer
                            .unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* ================= COUNTERS ================= */

function startCounters() {

    const counters =
        document.querySelectorAll(
            "[data-target]"
        );


    counters.forEach(counter => {

        const target =
            Number(
                counter.dataset.target
            );


        let current = 0;

        const increment =
            target / 50;


        const timer =
            setInterval(() => {

                current += increment;


                if (current >= target) {

                    counter.innerText =
                        target;

                    clearInterval(timer);

                } else {

                    counter.innerText =
                        Math.floor(current);

                }

            }, 30);

    });

}


/* ================= SCROLL TO MENU ================= */

function scrollToMenu() {

    document
        .getElementById("menu")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ================= SEARCH FOCUS ================= */

function focusSearch() {

    scrollToMenu();

    setTimeout(() => {

        document
            .getElementById("searchInput")
            .focus();

    }, 600);

}


/* ================= PRODUCT FILTER ================= */

function filterProducts(category, button) {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );

    const buttons =
        document.querySelectorAll(
            ".category"
        );


    buttons.forEach(btn => {

        btn.classList.remove("active");

    });


    button.classList.add("active");


    let visibleCount = 0;


    cards.forEach(card => {

        const cardCategory =
            card.dataset.category;


        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    document
        .getElementById("noResults")
        .style.display =
            visibleCount === 0
                ? "block"
                : "none";

}


/* ================= SEARCH ================= */

function searchProducts() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    let count = 0;


    cards.forEach(card => {

        const name =
            card.dataset.name
                .toLowerCase();


        if (name.includes(search)) {

            card.style.display = "block";

            count++;

        } else {

            card.style.display = "none";

        }

    });


    document
        .getElementById("noResults")
        .style.display =
            count === 0
                ? "block"
                : "none";

}


/* ================= CLEAR SEARCH ================= */

function clearSearch() {

    document
        .getElementById("searchInput")
        .value = "";


    searchProducts();

}


/* ================= FAVORITES ================= */

function toggleFavorite(button) {

    button.classList.toggle("liked");


    const icon =
        button.querySelector("i");


    if (
        button.classList.contains("liked")
    ) {

        icon.classList.remove(
            "fa-regular"
        );

        icon.classList.add(
            "fa-solid"
        );

        showToast(
            "Added to favorites ❤️"
        );

    } else {

        icon.classList.remove(
            "fa-solid"
        );

        icon.classList.add(
            "fa-regular"
        );

        showToast(
            "Removed from favorites"
        );

    }

}


/* ================= ADD TO CART ================= */

function addToCart(name, price) {

    const existing =
        cart.find(
            item =>
                item.name === name
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    updateCart();


    showToast(
        `${name} added to your bag ☕`
    );


    /* Automatically open cart */

    openCart();

}


/* ================= UPDATE CART ================= */

function updateCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    /* Quantity */

    let totalQuantity = 0;


    cart.forEach(item => {

        totalQuantity +=
            item.quantity;

    });


    cartCount.innerText =
        totalQuantity;


    /* Empty */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    ☕
                </div>

                <h3>
                    Your bag is empty
                </h3>

                <p>
                    Add your favourite coffee
                    to get started.
                </p>

                <button
                    onclick="closeCart();scrollToMenu()">

                    Explore Menu

                </button>

            </div>

        `;

        cartTotal.innerText =
            "₹0";

        return;
    }


    let total = 0;


    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        const itemTotal =
            item.price *
            item.quantity;


        total += itemTotal;


        cartItems.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-image">
                    ☕
                </div>


                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ₹${item.price}
                    </p>


                    <div class="cart-controls">

                        <button
                            onclick="changeQuantity(${index}, -1)">

                            −

                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${index}, 1)">

                            +

                        </button>

                    </div>

                </div>


                <button
                    class="remove-item"
                    onclick="removeItem(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

    });


    cartTotal.innerText =
        "₹" + total;

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(index, amount) {

    if (!cart[index]) return;


    cart[index].quantity +=
        amount;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    updateCart();

}


/* ================= REMOVE ITEM ================= */

function removeItem(index) {

    if (!cart[index]) return;


    const item =
        cart[index].name;


    cart.splice(index, 1);


    updateCart();


    showToast(
        `${item} removed from bag`
    );

}


/* ================= OPEN CART ================= */

function openCart() {

    document
        .getElementById("cartDrawer")
        .classList.add("active");


    document
        .getElementById("cartOverlay")
        .classList.add("active");


    document.body.style.overflow =
        "hidden";

}


/* ================= CLOSE CART ================= */

function closeCart() {

    document
        .getElementById("cartDrawer")
        .classList.remove("active");


    document
        .getElementById("cartOverlay")
        .classList.remove("active");


    document.body.style.overflow =
        "";
}


/* ================= CHECKOUT ================= */

function checkout() {

    if (cart.length === 0) {

        showToast(
            "Your bag is empty ☕"
        );

        return;
    }


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;

    });


    document
        .getElementById("modalTotal")
        .innerText =
            "₹" + total;


    document
        .getElementById("checkoutModal")
        .classList.add("active");

}


/* ================= CLOSE CHECKOUT ================= */

function closeCheckout() {

    document
        .getElementById("checkoutModal")
        .classList.remove("active");

}


/* ================= FINISH ORDER ================= */

function finishOrder() {

    closeCheckout();

    cart = [];

    updateCart();

    closeCart();


    showToast(
        "🎉 Order confirmed! Thank you."
    );

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const text =
        toast.querySelector("span");


    text.innerText =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* ================= CLAIM OFFER ================= */

function claimOffer(offerName) {

    showToast(
        `🎁 ${offerName} claimed!`
    );

}


/* ================= REWARDS ================= */

function joinRewards() {

    showToast(
        "⭐ Welcome to Star Rewards!"
    );

}


/* ================= STORE LOCATOR ================= */

function findStore() {

    const input =
        document
            .getElementById(
                "locationInput"
            )
            .value
            .trim();


    const result =
        document
            .getElementById(
                "locationResult"
            );


    if (!input) {

        result.innerText =
            "Please enter your city 📍";

        return;
    }


    result.innerHTML =
        `📍 Showing coffee shops near <strong>${input}</strong>`;

}


/* ================= SOCIAL ================= */

function socialClick(platform) {

    event.preventDefault();

    showToast(
        `${platform} page coming soon 📱`
    );

}


/* ================= MOBILE MENU ================= */

function toggleMobileMenu() {

    document
        .getElementById("mobileNav")
        .classList.toggle("show");

}


/* ================= MOBILE LINK CLOSE ================= */

document
    .querySelectorAll("#mobileNav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "mobileNav"
                    )
                    .classList.remove(
                        "show"
                    );

            }
        );

    });


/* ================= DARK MODE ================= */

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


themeBtn.addEventListener(
    "click",
    () => {

        document.body
            .classList
            .toggle("dark");


        const icon =
            themeBtn.querySelector("i");


        if (
            document.body.classList
                .contains("dark")
        ) {

            icon.classList.remove(
                "fa-moon"
            );

            icon.classList.add(
                "fa-sun"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            icon.classList.remove(
                "fa-sun"
            );

            icon.classList.add(
                "fa-moon"
            );

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


/* ================= LOAD THEME ================= */

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (savedTheme === "dark") {

    document.body
        .classList
        .add("dark");


    const icon =
        themeBtn.querySelector("i");


    icon.classList.remove(
        "fa-moon"
    );

    icon.classList.add(
        "fa-sun"
    );

}


/* ================= ESCAPE KEY ================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCart();

            closeCheckout();

        }

    }
);


/* ================= NAVBAR SCROLL ================= */

window.addEventListener(
    "scroll",
    () => {

        const header =
            document.getElementById(
                "header"
            );


        if (window.scrollY > 50) {

            header.style.boxShadow =
                "0 5px 30px rgba(0,0,0,.12)";

        } else {

            header.style.boxShadow =
                "0 3px 25px rgba(0,0,0,.07)";

        }

    }
);


/* ================= ACTIVE NAV ================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;


            if (
                window.scrollY >=
                sectionTop
            ) {

                current =
                    section.getAttribute(
                        "id"
                    );

            }

        });


        document
            .querySelectorAll(
                ".nav-links a"
            )
            .forEach(link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) === "#" + current
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            });

    }
);