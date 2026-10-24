"use strict";
(() => {
    const outline = document.querySelector('.page-outline');
    if (!outline) return;
    const compact = window.matchMedia('(max-width: 900px)');
    const adapt = () => { outline.open = !compact.matches; };
    adapt();
    compact.addEventListener('change', adapt);
    // Keep the overview out of the way on small screens after choosing a section.
    outline.addEventListener('click', event => {
        if (compact.matches && event.target.closest('a')) outline.open = false;
    });
})();
