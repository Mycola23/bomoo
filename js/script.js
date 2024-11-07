"use strict";

const mainMenu = document.querySelector(".menu__list");
console.log(mainMenu);

mainMenu.addEventListener("click", (e) => {
    let target = e.target;
    if (target.closest(".item__title")) {
        target.parentElement.classList.toggle("__active");
    }
});

/* special text for fixing all */

////jjj
