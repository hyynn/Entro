/* 앵커 스크롤 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* 스크롤 상단 버튼 */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* 로봇 — 사인파 경로 + 각도 */
const robot = document.getElementById('robot');
let prevX = 120;
let prevY = 150;

function updateRobot(biyul) {
    if (!robot) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const amplitude = vw * 0.35;
    const freqX = 6;
    const freqY = 9;

    const targetX = vw / 2 + amplitude * Math.sin(biyul * Math.PI * freqX);
    const targetY = vh * 0.4 + vh * 0.2 * Math.cos(biyul * Math.PI * freqY);

    const blend = Math.min(biyul / 0.15, 1);
    const x = 120 + (targetX - 120) * blend;
    const y = 150 + (targetY - 150) * blend;

    const dx = x - prevX;
    const dy = y - prevY;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        robot.style.transform = `rotate(${angle}deg)`;
    }

    robot.style.left = (x - 25) + 'px';
    robot.style.top = (y - 25) + 'px';

    prevX = x;
    prevY = y;
}

/* 로드 시 즉시 초기 위치 설정 */
updateRobot(0);

/* Hero 진입 애니메이션 */
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';

    window.addEventListener('load', () => {
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    });
}

/* Stats/Trust 카운트업 — easeOutCubic 이징, 뷰포트 진입 시 1회 실행 */
function formatNumber(num) {
    return num.toLocaleString('ko-KR');
}

function animateCountEl(el) {
    const target = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || '0', 10);
    el.style.display = 'inline-block';
    el.textContent = decimal > 0 ? '0.0' : '0';

    const duration = 1800;
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = ease * target;

        el.textContent = decimal > 0
            ? current.toFixed(decimal)
            : formatNumber(Math.floor(current));

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = decimal > 0 ? target.toFixed(decimal) : formatNumber(target);
        }
    }
    requestAnimationFrame(step);
}

function observeAndCount(sectionSelector, itemSelector) {
    const items = document.querySelectorAll(itemSelector);
    const section = document.querySelector(sectionSelector);
    if (!items.length || !section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                items.forEach(el => animateCountEl(el));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(section);
}

observeAndCount('.stats-banner', '.stat-number');
observeAndCount('.trust-numbers', '.trust-count');

/* 탭 전환 시 Bento 카드 순차 페이드인 */
function showBentoCards(panel) {
    panel.querySelectorAll('.bento-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 100);
    });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
            panel.hidden = true;
        });

        const target = document.getElementById('tab-' + tab);
        if (target) {
            target.classList.add('active');
            target.hidden = false;
            showBentoCards(target);
        }
    });
});


/* Pricing */
const pricingSection = document.querySelector('.pricing');
if (pricingSection) {
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.pricing-list li').forEach((li, i) => {
                    li.style.opacity = '0';
                    li.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        li.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        li.style.opacity = '1';
                        li.style.transform = 'translateY(0)';
                    }, i * 180);
                });
                pricingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    pricingObserver.observe(pricingSection);
}

/* FAQ 아코디언 */
document.querySelectorAll('.faq-list li').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-list li').forEach(i => {
            i.classList.remove('active');
            i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
            item.classList.add('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        }
    });
});

/* GNB 활성 섹션 표시 — 스크롤 이벤트 대신 Observer로 성능 최적화 */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('header .gnb a');

if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));
}


/* Solution 카드 — 터치 디바이스 대응 */
if ('ontouchstart' in window) {
    document.querySelectorAll('.solution-card').forEach(card => {
        card.addEventListener('click', () => {
            /* 다른 카드 닫기 */
            document.querySelectorAll('.solution-card').forEach(c => {
                if (c !== card) c.classList.remove('touch-active');
            });
            card.classList.toggle('touch-active');
        });
    });
}



/*헤더 + 스크롤 버튼 + 로봇 */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const biyul = docH > 0 ? scrollY / docH : 0;

    document.querySelector('header').classList.toggle('scrolled', scrollY > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', scrollY > 400);

    updateRobot(biyul);
});

/* AOS 초기화 */
AOS.init({ offset: 0, duration: 700, once: true });