import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const isIcon = block.classList.contains('icon');
  const isCalendar = block.classList.contains('calendar');

  // function for adding spreadsheet json source
  async function fetchJson(link) {
    const response = await fetch(link?.href);
    if (response.ok) {
      const jsonData = await response.json();
      const data = jsonData?.data;
      return data;
    }
    return 'an error occurred';
  }

  const ul = document.createElement('ul');

  if(isCalendar) {
	const link = block.querySelector('a');
	const cardData = await fetchJson(link);
	
	cardData.forEach((event) => {
		const createdCard = document.createElement('li');
		createdCard.innerHTML = `
		<a href="${event.url}" aria-label="${event['anchor-text']}"}">
			<div class="cards-card-body">
				<span>
					<p>${event.dates}</p>
				</span>
				<h5>${event.title}
					<span class="card-arrow">
                		<img class="icon" src="/icons/chevron-right.svg" />
              		</span>
				</h5>
			</div>
		</a>
		`;
		ul.append(createdCard);
	});

  } else {
    [...block.children].forEach((row) => {
      const anchor = document.createElement('a');
      anchor.href = '';
      const li = document.createElement('li');
      while (row.firstElementChild) li.append(row.firstElementChild);
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && isIcon && div.querySelector('a')) {
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
	  
	  if(isIcon) {
		anchor.append(li);
		ul.append(anchor);
	  } else {
		ul.append(li);
	  }
    })
};

  block.textContent = '';
  block.append(ul);
}
