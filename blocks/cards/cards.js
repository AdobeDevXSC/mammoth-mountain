import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const isIcon = block.classList.contains('icon');

// un-comment this when adding spreadsheet source
//   async function fetchJson(link) {
//     const response = await fetch(link?.href);

//     if (response.ok) {
//       const jsonData = await response.json();
//       const data = jsonData?.data;
//       return data;
//     }
//     return 'an error occurred';
//   }

  const ul = document.createElement('ul');
    [...block.children].forEach((row) => {
      const anchor = document.createElement('a');
      anchor.href = '';
      const li = document.createElement('li');
      while (row.firstElementChild) li.append(row.firstElementChild);
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('a')) {
          const linkURL = div.querySelector('a').innerHTML;
          anchor.href = linkURL;
          div.className = 'cards-hide-markdown';
        } else if (div.children.length === 1 && div.querySelector('picture')) {
          div.className = 'cards-card-image';
        } else if (div.children.length === 1 && div.querySelector('span')) {
          div.className = 'cards-card-icon';
        } else {
          div.className = 'cards-card-body';
        }
      });
	  if (isIcon) {
		anchor.append(li);
		ul.append(anchor);
	  } else {
		ul.append(li);
	  }
    });

  block.textContent = '';
  block.append(ul);
}
