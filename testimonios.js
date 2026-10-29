(function () {
  'use strict';

  var dialog = document.getElementById('case-modal');
  var title = document.getElementById('case-modal-title');
  var media = document.getElementById('case-modal-media');
  var closeButton = dialog && dialog.querySelector('.case-modal-close');
  if (!dialog || !title || !media || !closeButton || !dialog.showModal) return;

  var lastTrigger = null;

  function closeModal() {
    dialog.close();
  }

  function openVideo(card) {
    var url = new URL(card.href);
    var name = card.querySelector('strong');
    var poster = card.querySelector('img');
    var player;

    if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
      var id = url.searchParams.get('v');
      if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      player = document.createElement('iframe');
      player.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      player.title = 'Testimonio de ' + (name ? name.textContent : 'cliente');
      player.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
      player.allowFullscreen = true;
    } else if (url.pathname.toLowerCase().endsWith('.mp4')) {
      player = document.createElement('video');
      player.src = url.href;
      player.controls = true;
      player.playsInline = true;
      player.preload = 'metadata';
      player.setAttribute('controlsList', 'nodownload noremoteplayback');
      player.disablePictureInPicture = true;
      player.addEventListener('contextmenu', function (event) { event.preventDefault(); });
      if (poster) player.poster = poster.src;
    } else {
      return;
    }

    lastTrigger = card;
    title.textContent = name ? name.textContent : 'Caso de éxito';
    media.replaceChildren(player);
    dialog.showModal();
    document.body.classList.add('case-modal-open');
    if (player instanceof HTMLVideoElement) player.play().catch(function () {});
    closeButton.focus();
  }

  document.querySelectorAll('.case-card').forEach(function (card) {
    card.removeAttribute('target');
    card.addEventListener('click', function (event) {
      event.preventDefault();
      openVideo(card);
    });
  });

  closeButton.addEventListener('click', closeModal);
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) closeModal();
  });
  dialog.addEventListener('close', function () {
    media.replaceChildren();
    document.body.classList.remove('case-modal-open');
    if (lastTrigger) lastTrigger.focus();
  });
})();
