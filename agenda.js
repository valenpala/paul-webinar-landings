(function () {
  'use strict';

  var urls = {
    AR: 'https://app.iclosed.io/e/yinyang/cristiansocial-arg',
    WLD: 'https://app.iclosed.io/e/yinyang/cristiansocial-wld'
  };
  var mount = document.getElementById('agenda-widget');
  var status = document.getElementById('agenda-estado');
  var retry = document.getElementById('agenda-reintentar');
  if (!mount || !status || !retry) return;

  function showError() {
    status.textContent = 'No pudimos cargar la agenda. Intentá de nuevo en unos segundos.';
    retry.hidden = false;
  }

  function showCalendar(country) {
    mount.replaceChildren();
    retry.hidden = true;
    status.hidden = false;
    status.textContent = 'Cargando horarios disponibles…';

    var widget = document.createElement('div');
    widget.className = 'iclosed-widget';
    widget.dataset.url = urls[country === 'AR' ? 'AR' : 'WLD'] + window.location.search;
    widget.title = 'Auditoría 1-1 con Paul o su equipo';
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

  function detectCountry() {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 3500);
    fetch('https://api.country.is/', { signal: controller.signal })
      .then(function (response) {
        if (!response.ok) throw new Error('Geo lookup failed');
        return response.json();
      })
      .then(function (data) { showCalendar(data && data.country === 'AR' ? 'AR' : 'WLD'); })
      .catch(function () {
        return fetch('https://ipwho.is/')
          .then(function (response) { return response.json(); })
          .then(function (data) { showCalendar(data && data.country_code === 'AR' ? 'AR' : 'WLD'); })
          .catch(function () { showCalendar('WLD'); });
      })
      .finally(function () { clearTimeout(timer); });
  }

  retry.addEventListener('click', detectCountry);
  detectCountry();
})();
