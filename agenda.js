(function () {
  'use strict';

  var eventUrl = 'https://app.iclosed.io/e/yinyang/auditoria-1-1';
  var mount = document.getElementById('agenda-widget');
  var status = document.getElementById('agenda-estado');
  var retry = document.getElementById('agenda-reintentar');
  if (!mount || !status || !retry) return;

  function showError() {
    status.textContent = 'No pudimos cargar la agenda. Intentá de nuevo en unos segundos.';
    retry.hidden = false;
  }

  function showCalendar() {
    mount.replaceChildren();
    retry.hidden = true;
    status.hidden = false;
    status.textContent = 'Cargando horarios disponibles…';

    var widget = document.createElement('div');
    widget.className = 'iclosed-widget';
    widget.dataset.url = eventUrl + window.location.search;
    widget.title = 'Auditoría 1-1 Webi';
    widget.style.width = '100%';
    widget.style.height = '620px';
    mount.appendChild(widget);

    var script = document.createElement('script');
    script.src = 'https://app.iclosed.io/assets/widget.js';
    script.async = true;
    script.onerror = showError;
    document.body.appendChild(script);

    var observer = new MutationObserver(function () {
      if (widget.querySelector('iframe')) {
        status.hidden = true;
        observer.disconnect();
      }
    });
    observer.observe(widget, { childList: true, subtree: true });
  }

  retry.addEventListener('click', showCalendar);
  showCalendar();
})();
