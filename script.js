const heroVideo = document.querySelector('.hero-video');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const updateHeroVideo = async () => {
  if (motionPreference.matches) {
    heroVideo.pause();
    heroVideo.hidden = true;
    return;
  }
  heroVideo.hidden = false;
  heroVideo.muted = true;
  if (!heroVideo.getAttribute('src')) heroVideo.src = heroVideo.dataset.src;
  try { await heroVideo.play(); }
  catch { heroVideo.hidden = true; }
};
motionPreference.addEventListener('change', updateHeroVideo);
updateHeroVideo();

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const closeMenu = (restoreFocus = false) => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Отвори мени');
  nav.classList.remove('is-open');
  if (restoreFocus) menuButton.focus();
};
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Затвори мени' : 'Отвори мени');
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.querySelectorAll('.brand[href="#top"]').forEach(brand => {
  brand.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: motionPreference.matches ? 'instant' : 'smooth' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 821px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.querySelectorAll('.film-media').forEach(media => {
  const video = media.querySelector('video');
  const button = media.querySelector('button');
  const source = video.querySelector('source');
  const errorMessage = media.querySelector('.video-error');
  video.controls = false;
  button.addEventListener('click', async () => {
    document.querySelectorAll('.film-media video').forEach(other => { if (other !== video) other.pause(); });
    errorMessage.hidden = true;
    media.classList.remove('has-error');
    video.controls = true;
    if (!source.src) { source.src = source.dataset.src; video.load(); }
    button.disabled = true;
    try { await video.play(); media.classList.add('has-started'); }
    catch { media.classList.add('has-error'); errorMessage.hidden = false; }
    finally { button.disabled = false; }
  });
  video.addEventListener('play', () => media.classList.add('is-playing'));
  video.addEventListener('pause', () => media.classList.remove('is-playing'));
  video.addEventListener('ended', () => { media.classList.remove('is-playing', 'has-started'); });
});
