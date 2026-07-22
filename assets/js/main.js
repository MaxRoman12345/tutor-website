/* Systemised Maths — click-to-enlarge gallery images */
(function () {
  'use strict';

  var dialog = document.getElementById('lightbox');
  if (!dialog) return;

  var full    = dialog.querySelector('.lightbox__frame img');
  var caption = dialog.querySelector('.lightbox__caption');
  var count   = dialog.querySelector('.lightbox__count');
  var controls = dialog.querySelector('.lightbox__controls');

  var group = [];   /* shots in the gallery currently being viewed */
  var index = 0;

  function show(i) {
    index = (i + group.length) % group.length;

    var shot = group[index];
    var img  = shot.querySelector('img');

    full.src = img.currentSrc || img.src;
    full.alt = img.alt;
    caption.textContent = shot.dataset.caption || '';
    count.textContent = (index + 1) + ' / ' + group.length;
    controls.hidden = group.length < 2;
  }

  function open(shot) {
    var gallery = shot.closest('.gallery');
    group = Array.prototype.slice.call(
      (gallery || document).querySelectorAll('.shot')
    );
    show(group.indexOf(shot));

    document.documentElement.classList.add('is-locked');
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function unlock() {
    document.documentElement.classList.remove('is-locked');
    full.removeAttribute('src');
  }

  function close() {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    unlock();
  }

  document.querySelectorAll('.shot').forEach(function (shot) {
    shot.addEventListener('click', function () { open(shot); });
  });

  dialog.addEventListener('click', function (event) {
    var action = event.target.dataset ? event.target.dataset.lb : null;

    if (action === 'close') return close();
    if (action === 'prev')  return show(index - 1);
    if (action === 'next')  return show(index + 1);

    /* click on empty space around the image closes it */
    if (!event.target.closest('.lightbox__frame, .lightbox__controls')) close();
  });

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { event.preventDefault(); return close(); }
    if (group.length < 2) return;
    if (event.key === 'ArrowLeft')  { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
  });

  /* belt and braces: Esc handled by the browser, or dialog.close() elsewhere */
  dialog.addEventListener('cancel', unlock);
  dialog.addEventListener('close', unlock);
})();
