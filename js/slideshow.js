const imgList = document.querySelectorAll('.img-item')
const subImgs = document.querySelector('.img-list')
const prevBtn = document.querySelector('.control.prev')
const nextBtn = document.querySelector('.control.next')
const mainImg = document.querySelector('.main-img img')
let currentIndex = 0
let autoPlay = true

imgList.forEach((img, index) => {
    img.addEventListener('click', () => {
        clearInterval(interval)
        currentIndex = index
        mainImg.style.animation = ''
        setTimeout(() => {
            updateImageByIndex(index)
            mainImg.style.animation = 'fadeOut ease-in-out .5s forwards'
        })
    })
})

function updateImageByIndex(index) {
    imgList.forEach((img) => {
        if (img.classList.contains('active')) {
            img.classList.remove('active')
        }
    })
    imgList[index].classList.add('active')
    mainImg.src = imgList[index].querySelector('img').src

//     const activeImg = subImgs.querySelector('.img-item.active') 
//     activeImg.scrollIntoView({behavior: 'smooth', inline: "center", block: "nearest" })
}

function autoSlideShow () {
    autoPlay = true
    currentIndex++
    if (currentIndex == imgList.length) {
        currentIndex = 0
    }
    mainImg.style.animation = ''
        setTimeout(() => {
            updateImageByIndex(currentIndex)
            mainImg.style.animation = 'fadeOut ease-in-out .5s forwards'
        }, 0)
}
const interval = setInterval(autoSlideShow, 3000)

prevBtn.addEventListener('click', () => {
    clearInterval(interval)
    // if (autoPlay) {
    //     currentIndex -= 1
    //     autoPlay = false
    // } 
    mainImg.style.animation = ''
    setTimeout(() => {
        prevImg()
        mainImg.style.animation = 'slideLeft ease-in-out .5s forwards'
    }, 0)
})

nextBtn.addEventListener('click', () => {
    clearInterval(interval)
    // if (autoPlay) {
    //     currentIndex -= 1
    //     autoPlay = false
    // } 
    mainImg.style.animation = ''
    setTimeout(() => {
        nextImg()
        mainImg.style.animation = 'slideRight ease-in-out .5s forwards'
    }, 0)
})

function prevImg () {
    if (currentIndex == 0) {
        currentIndex = imgList.length - 1
    } else {
        currentIndex--
    }
    updateImageByIndex(currentIndex)
}

function nextImg () {
    if (currentIndex == imgList.length - 1) {
        currentIndex = 0
    } else {
        currentIndex++
    }
    updateImageByIndex(currentIndex)
}
