

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const href = this.getAttribute('href');

            if (href === '#part2_2') {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

const scrollTopBtn = document.getElementById('scrollTop');

scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 스크롤 이벤트 통합
$(window).scroll(function () {
    const scrollTop = $(window).scrollTop();

    // 헤더 스타일 변경
    if (scrollTop > 100) {
        $('header').addClass('scrolled');
    } else {
        $('header').removeClass('scrolled');
    }

    // 스크롤 버튼 처리
    if (scrollTop > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});