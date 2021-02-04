'use strict';

const burgerBtn = document.querySelector('.hamburger-btn');
const burgerMenu = document.querySelector('.burger-menu');
const closeBurgerMenu = document.querySelector('.burger-menu__close');

burgerBtn.addEventListener('click', function() {
    burgerMenu.classList.add('burger-menu--active');
});

closeBurgerMenu.addEventListener('click', function() {
    burgerMenu.classList.remove('burger-menu--active');
});


