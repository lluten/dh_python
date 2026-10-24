"use strict";
(() => {
 const labels = {"01a": "01a \u00b7 Introduction and setup", "03a": "03a \u00b7 Numbers", "04a": "04a \u00b7 Regular expressions", "04b": "04b \u00b7 Formal languages", "04c": "04c \u00b7 Regex in Python", "05b": "05b \u00b7 Tuples", "06b": "06b \u00b7 Input/output in Python", "08b": "08b \u00b7 Exceptions and debugging", "09a": "09a \u00b7 References and identity", "10b": "10b \u00b7 spaCy and NLTK", "10b-fallback": "10b \u00b7 NLTK-only fallback", "10c": "10c \u00b7 Corpora and language resources", "11b": "11b \u00b7 Encapsulation and inheritance", "extra": "Additional resources"};
 const list = document.getElementById('resource-list');
 const cards = Array.from(list.children);
 const group = document.getElementById('group-by');
 const lecture = document.getElementById('lecture-filter');
 const search = document.getElementById('resource-search');
 const params = new URLSearchParams(location.search);
 if (params.get('group') === 'topic') group.value = 'topic';
 if (Array.from(lecture.options).some(o => o.value === params.get('lecture'))) lecture.value = params.get('lecture');
 search.value = params.get('q') || '';
 function render() {
  const query = search.value.trim().toLowerCase();
  const matches = cards.filter(card => (lecture.value === 'all' || card.dataset.lectures.split(' ').includes(lecture.value)) && card.textContent.toLowerCase().includes(query));
  const groups = new Map();
  for (const card of matches) {
   const key = group.value === 'topic' ? card.dataset.topic : (lecture.value === 'all' ? card.dataset.lectures.split(' ')[0] : lecture.value);
   if (!groups.has(key)) groups.set(key, []);
   groups.get(key).push(card);
  }
  list.replaceChildren();
  const outline = document.getElementById('page-sections');
  outline.replaceChildren();
  document.querySelector('.page-outline').hidden = groups.size === 0;
  for (const key of Array.from(groups.keys()).sort()) {
   const section = document.createElement('section');
   const heading = document.createElement('h2');
   heading.textContent = group.value === 'topic' ? key : labels[key];
   section.id = 'resources-' + key.toLowerCase().replace(/[^a-z0-9]+/g, '-');
   const item = document.createElement('li');
   const link = document.createElement('a');
   link.href = '#' + section.id;
   link.textContent = heading.textContent;
   item.append(link); outline.append(item);
   section.append(heading);
   const grid = document.createElement('div'); grid.className = 'resource-entries';
   groups.get(key).sort((a,b) => a.querySelector('a').textContent.localeCompare(b.querySelector('a').textContent)).forEach(card => grid.append(card));
   section.append(grid); list.append(section);
  }
  document.getElementById('resource-count').textContent = matches.length ? `${matches.length} resources` : 'No matching resources. Try another search or reset the filters.';
  const url = new URL(location.href);
  url.search = '';
  if (group.value !== 'lecture') url.searchParams.set('group', group.value);
  if (lecture.value !== 'all') url.searchParams.set('lecture', lecture.value);
  if (search.value) url.searchParams.set('q', search.value);
  try { history.replaceState(null, '', url); } catch (_) { /* Local file previews may restrict history. */ }
 }
 document.querySelector('.resource-controls').hidden = false;
 group.addEventListener('change', render); lecture.addEventListener('change', render); search.addEventListener('input', render);
 document.getElementById('reset-resources').addEventListener('click', () => {group.value = 'lecture'; lecture.value = 'all'; search.value = ''; render();});
 render();
})();
