document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const dotsContainer = document.querySelector('.carousel-dots');
    const carouselContainer = document.querySelector('.carousel-container');

    let currentIndex = 0;
    let autoplayInterval;

    function generateDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function initializeCarousel() {
        track.style.width = `${slides.length * 100}%`;
        slides.forEach(slide => {
            slide.style.width = `${100 / slides.length}%`;
        });
        track.style.transition = 'transform 0.5s ease-in-out';
        generateDots();
    }

    function moveToSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }

        currentIndex = index;
        const offset = -index * (100 / slides.length);
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function updateDots() {
        const dots = Array.from(document.querySelectorAll('.carousel-dot'));
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function startAutoplay() {
        stopAutoplay(); // evita múltiplos intervals
        autoplayInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
        resetAutoplay();
    });

    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
        resetAutoplay();
    });

    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Swipe Mobile
    let touchStartX = 0;

    carouselContainer.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    });

    carouselContainer.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                moveToSlide(currentIndex - 1);
            } else {
                moveToSlide(currentIndex + 1);
            }
        }
        startAutoplay();
    });

    initializeCarousel();
    moveToSlide(0);
    startAutoplay();
});
