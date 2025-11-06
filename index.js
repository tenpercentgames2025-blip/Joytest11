// 슬라이더 기능 (슬라이더가 있을 때만 작동)
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    // 슬라이드 표시 함수
    function showSlide(index) {
        if (totalSlides === 0) return;
        
        // 인덱스 범위 조정
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // 모든 슬라이드 숨기기
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // 모든 dot 비활성화
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // 현재 슬라이드와 dot 활성화
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    // 다음 슬라이드
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // 이전 슬라이드
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // 이벤트 리스너 등록
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    // Dot 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });

    // 자동 슬라이드 (3초마다)
    let autoSlideInterval;

    function startAutoSlide() {
        if (totalSlides === 0) return;
        // 기존 인터벌이 있으면 제거
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 3000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // 자동 슬라이드 시작
    if (totalSlides > 0) {
        startAutoSlide();
    }

    // 슬라이더에 마우스 올리면 자동 슬라이드 중지 (PC)
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', () => {
        if (totalSlides > 0) {
            startAutoSlide();
        }
    });

    // 터치 스와이프 지원
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        // 터치 끝나고 1초 후 자동 슬라이드 재시작
        if (totalSlides > 0) {
            setTimeout(startAutoSlide, 1000);
        }
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // 왼쪽으로 스와이프 - 다음 슬라이드
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            // 오른쪽으로 스와이프 - 이전 슬라이드
            prevSlide();
        }
    }
}

// 모바일 메뉴 토글
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const navCloseBtn = document.querySelector('.nav-close-btn');

if (mobileMenuBtn && nav) {
    // 클릭 이벤트
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // 터치 이벤트 (모바일 지원)
    mobileMenuBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // 닫기 버튼 클릭 이벤트
    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        });

        navCloseBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    }

    // 메뉴 링크 클릭시 메뉴 닫기
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // 외부 클릭시 메뉴 닫기
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active')) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            }
        }
    });
}

// 부드러운 스크롤 네비게이션 (사이드 네비게이션)
document.querySelectorAll('.nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 부드러운 스크롤 네비게이션 (PC 헤더 네비게이션)
document.querySelectorAll('.pc-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 헤더 높이만큼 오프셋 조정
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

