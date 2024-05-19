/**
 * loads and decorates the cta grid
 * @param {Element} block The cta grid block element
 */

export default function decorate(block) {
	const cols = [...block.firstElementChild.children];
  
	const underlay = document.createElement('div');
	underlay.className = 'dark';
	// setup image columns
	[...block.children].forEach((row) => {
	  [...row.children].forEach((col) => {
		if (pic) {
		  const picWrapper = pic.closest('div');
		  if (picWrapper && picWrapper.children.length === 1) {
			// picture is only content in column
			picWrapper.classList.add('img-col');
		  }
		}
	  });
	});

	block.textContent = '';
	block.append(underlay);
  }