const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const logo = $('.navbar__logo')
const navBtns = $$('.navbar__item')
const navMenuBtn = $('.navbar__menu')
const navList = $('.navbar__list')
const slider = $('.slider')
const backgroundCaption = $('.background__caption')
const sliderHome = $('.slider__content ul li a')
const footerLogo = $('.footer__logo')
let isMenuOpen = false
const currentNavIndex = JSON.parse(localStorage.getItem('currentIndex'))

navBtns.forEach((btn, index) => {
    btn.onclick = () => {
        $('.navbar__item.active').classList.remove('active')
        btn.classList.add('active')
        saveCurrentNavIndex()
        showCurrentPage()
    }
})

if (sliderHome) {
    sliderHome.onclick = backToHomePage
}

if (logo) {
    logo.onclick = backToHomePage
}

if (footerLogo) {
    footerLogo.onclick = backToHomePage
}

if (navMenuBtn) {
    navMenuBtn.onclick = function() {
        if (isMenuOpen) {
            isMenuOpen = false
            navList.style.height = 0
            navList.style.opacity = 0
            if (backgroundCaption) backgroundCaption.style.marginTop = 0
            if (slider) slider.style.paddingTop = 140 + 'px'
        } else {
            isMenuOpen = true
            navList.style.height = 'auto'
            navList.style.opacity = 1
            const menuHeight = navList.offsetHeight
            console.log(menuHeight)
            if (backgroundCaption) {
                backgroundCaption.style.marginTop = `calc(${menuHeight}px / 4)`
            }
            if (slider) {
                slider.style.paddingTop = `calc(${menuHeight}px + 80px + 100px)`
            }
        }
    }
}

function showCurrentPage() {
    saveCurrentNavIndex()
    navBtns.forEach((btn) => {
        if (btn.classList.contains('active')) {
            if (currentNavIndex) {
                const currentNavBtn = navBtns[currentNavIndex].querySelector('.navbar__item-link')
                currentNavBtn.style.color = 'var(--primary-color)'
                currentNavBtn.style.setProperty('--navHeightBefore','28px');
            } else {
                const currentNavBtn = navBtns[0].querySelector('.navbar__item-link')
                currentNavBtn.style.color = 'var(--primary-color)'
                currentNavBtn.style.setProperty('--navHeightBefore','28px');
            }
        }
    })
    console.log(currentNavIndex)
}

function saveCurrentNavIndex() {
    navBtns.forEach((btn) => {
        if (btn.classList.contains('active')) {
            $('.navbar__item.active').classList.remove('active')
            btn.classList.add('active')
            const currentNavIndex = btn.getAttribute('data-index')
            localStorage.setItem('currentIndex', JSON.stringify(currentNavIndex))
        }
    })
    console.log(currentNavIndex)
}

function backToHomePage () {
    const currentNavIndex = navBtns[0].getAttribute('data-index')
    localStorage.setItem('currentIndex', JSON.stringify(currentNavIndex))
}

(function showDefaultStates() {
    'use strict'
    saveCurrentNavIndex()
    showCurrentPage()
})()
