/* Only adds chapter labels; all original interactions remain owned by the app. */
(() => {
  const boot = () => {
    document.querySelectorAll('#home > .card .card-title').forEach((title, i) => {
      title.dataset.chapter = String(i + 1).padStart(2, '0');
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
