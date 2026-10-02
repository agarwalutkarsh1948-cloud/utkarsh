document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
   1. PRELOADER ANIMATION
   ------------------------------------------------------------------------ */
const preloader = document.getElementById('preloader');
const words = document.querySelectorAll('.preloader-word');
let currentWordIndex = 0;

function cycleWords() {
  if (currentWordIndex < words.length - 1) {
    words[currentWordIndex].classList.remove('active');
    currentWordIndex++;
    words[currentWordIndex].classList.add('active');
  } else {
    clearInterval(wordInterval);
    setTimeout(() => {
      preloader.classList.add('slide-up');
    }, 300); // <-- REDUCED from 400ms (Faster slide-up exit)
  }
}

const wordInterval = setInterval(cycleWords, 300); // <-- REDUCED from 350ms (Faster word switching)
  /* ------------------------------------------------------------------------
     2. WORK CAROUSEL INTERACTION
     ------------------------------------------------------------------------ */
  const cards = document.querySelectorAll('.project-card');

  // collapsed-state number + icon (reference style)
  cards.forEach((c, i) => {
    const locked = c.querySelector('.card-action-btn.lock');
    c.insertAdjacentHTML('beforeend',
      `<span class="card-num"># ${String(i + 1).padStart(2, '0')}</span>` +
      `<span class="card-mini"><i class="${locked ? 'ri-lock-line' : 'ri-arrow-right-up-line'}"></i></span>`);
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (card.classList.contains('active')) return;
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  /* ------------------------------------------------------------------------
     3. SERVICES ACCORDION
     ------------------------------------------------------------------------ */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const open = () => {
      if (item.classList.contains('active')) return;
      accordionItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    };
    item.addEventListener('mouseenter', open); // hover opens (desktop)
    item.addEventListener('click', open);      // tap opens (mobile)
  });

  /* ------------------------------------------------------------------------
     4. EXPERIENCE FLOATING PREVIEW CARD ON MOUSEMOVE
     ------------------------------------------------------------------------ */
  const expItems = document.querySelectorAll('.exp-item');
  const previewCard = document.getElementById('expPreviewCard');
  const previewImg = document.getElementById('previewImg');

  expItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const imgSrc = item.getAttribute('data-preview');
      previewImg.src = imgSrc;
      previewCard.classList.add('show');
    });

    item.addEventListener('mousemove', (e) => {
      // follow the cursor horizontally, stay centred on the hovered row vertically
      const r = item.getBoundingClientRect();
      previewCard.style.left = `${e.clientX + 24 + 107}px`;
      previewCard.style.top = `${r.top + r.height / 2}px`;
    });

    item.addEventListener('mouseleave', () => {
      previewCard.classList.remove('show');
    });
  });


  /* 5. HERO TITLE HOVER REVEAL + 6. CURSOR BLOB (document-level, always works) */
  const titleWrap = document.querySelector('.hero-title-wrapper');
  const reveal = document.getElementById('titleReveal');
  const BW = 440, BH = 150;
  const hideReveal = () => { if (reveal) reveal.style.clipPath = 'inset(50% 50% 50% 50%)'; };

  const blob = document.createElement('div');
  blob.className = 'cursor-blob';
  document.body.appendChild(blob);
  let mx = -100, my = -100, bx = -100, by = -100, started = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!started) { bx = mx; by = my; started = true; blob.classList.add('show'); }

    if (titleWrap && reveal) {
      const r = titleWrap.getBoundingClientRect();
      if (my >= r.top && my <= r.bottom && mx >= r.left && mx <= r.right) {
        const x = mx - r.left, y = my - r.top;
        const l = Math.max(0, x - BW / 2), t = Math.max(0, y - BH / 2);
        const rt = Math.min(r.width, x + BW / 2), b = Math.min(r.height, y + BH / 2);
        reveal.style.clipPath = `inset(${t}px ${r.width - rt}px ${r.height - b}px ${l}px)`;
      } else hideReveal();
    }
    const hot = e.target.closest && e.target.closest('a, button, .project-card, .accordion-item, .exp-item');
    blob.classList.toggle('big', !!hot);
  });
  document.addEventListener('mouseleave', () => { hideReveal(); blob.classList.remove('show'); started = false; });

  (function loop() {
    bx += (mx - bx) * 0.18; by += (my - by) * 0.18;
    blob.style.transform = `translate(${bx}px, ${by}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

});