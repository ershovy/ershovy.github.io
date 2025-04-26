document.addEventListener('DOMContentLoaded', function () {
    const coordinates = [55.865773, 49.108660];

    const map = L.map('map', {
        center: coordinates,
        zoom: 17,
        attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''

    }).addTo(map);

    L.marker(coordinates)
        .addTo(map)
        .bindPopup('Место проведения свадьбы<br>ул. Дементьева, 51')
        .openPopup();
});

function openYandexMaps() {
    const address = encodeURIComponent('ул. Дементьева, 51, Казань');
    window.open(`https://yandex.ru/maps/?text=${address}&z=17`, '_blank');
}

class WeddingSlider {
    constructor() {
        this.slides = [...document.querySelectorAll('.slider__slide')];
        this.navDots = document.getElementById('sliderNav');
        this.currentIndex = 0;
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.createNavigation();
        this.addEventListeners();
        this.showSlide(this.currentIndex);
    }

    createNavigation() {
        this.slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'slider-nav__dot';
            dot.addEventListener('click', () => this.goToSlide(i));
            this.navDots.appendChild(dot);
        });
        this.updateNavigation();
    }

    async goToSlide(newIndex) {
        if (this.isAnimating || newIndex === this.currentIndex) return;

        this.isAnimating = true;
        const direction = newIndex > this.currentIndex ? 'next' : 'prev';
        const currentSlide = this.slides[this.currentIndex];

        currentSlide.classList.remove('slider__slide--active');
        this.animateOut(currentSlide, direction);

        const newSlide = this.slides[newIndex];
        await this.animateIn(newSlide, direction);

        this.currentIndex = newIndex;
        this.updateNavigation();
        this.isAnimating = false;
    }

    animateOut(slide, direction) {
        slide.style.transform = `translateY(${direction === 'next' ? '-20px' : '20px'})`;
        slide.style.opacity = '0';
    }

    async animateIn(slide, direction) {
        slide.style.display = 'flex';
        slide.style.transform = `translateY(${direction === 'next' ? '20px' : '-20px'})`;
        slide.style.opacity = '0';

        await new Promise(r => setTimeout(r, 10));

        slide.classList.add('slider__slide--active');
        slide.style.transform = 'translateY(0)';
        slide.style.opacity = '1';

        await new Promise(r => setTimeout(r, 600));
    }

    updateNavigation() {
        document.querySelectorAll('.slider-nav__dot').forEach((dot, i) => {
            dot.classList.toggle('slider-nav__dot--active', i === this.currentIndex);
        });
    }

    nextSlide() {
        const nextIndex = Math.min(this.currentIndex + 1, this.slides.length - 1);
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = Math.max(this.currentIndex - 1, 0);
        this.goToSlide(prevIndex);
    }

    addEventListeners() {
        document.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleWheel(e) {
        if (this.isAnimating) return;
        e.preventDefault();
        e.deltaY > 0 ? this.nextSlide() : this.prevSlide();
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = this.touchStartY - touchEndY;
        if (Math.abs(deltaY) > 50) {
            deltaY > 0 ? this.nextSlide() : this.prevSlide();
        }
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowDown') this.nextSlide();
        if (e.key === 'ArrowUp') this.prevSlide();
    }
}

class CountdownTimer {
    constructor() {
        this.elements = {
            days: null,
            hours: null,
            minutes: null,
            seconds: null
        };
        this.interval = null;
        this.init();
    }

    init() {
        const checkElements = () => {
            this.elements.days = document.getElementById('days');
            this.elements.hours = document.getElementById('hours');
            this.elements.minutes = document.getElementById('minutes');
            this.elements.seconds = document.getElementById('seconds');

            if (this.allElementsExist()) {
                this.startTimer();
            } else {
                requestAnimationFrame(checkElements);
            }
        };

        checkElements();
    }

    allElementsExist() {
        return this.elements.days && this.elements.hours &&
            this.elements.minutes && this.elements.seconds;
    }

    startTimer() {
        this.targetDate = new Date('2025-06-19T00:00:00');
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const diff = this.targetDate - now;

        if (diff < 0) {
            clearInterval(this.interval);
            this.setExpiredState();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.updateDisplay(days, hours, minutes, seconds);
    }

    updateDisplay(d, h, m, s) {
        this.elements.days.textContent = d;
        this.elements.hours.textContent = String(h).padStart(2, '0');
        this.elements.minutes.textContent = String(m).padStart(2, '0');
        this.elements.seconds.textContent = String(s).padStart(2, '0');
    }

    setExpiredState() {
        const countdownContainer = document.querySelector('.countdown');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
        <div class="countdown__item" style="grid-column: 1 / -1;">
            <div class="countdown__number">🎉</div>
            <div class="countdown__label">Свадьба началась!</div>
        </div>
    `;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new WeddingSlider();
    new CountdownTimer();
});


document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('testing');
    this.reset();
});

window.timer = new CountdownTimer();