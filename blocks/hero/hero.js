/**
 * loads and decorates the hero
 * @param {Element} block The hero block element
 */

export default async function decorate(block) {
	const imgBlockChildren = block.children[0];
	imgBlockChildren.className = 'hero-image-wrapper';
	[...imgBlockChildren.children].forEach((child) => {
	  const pictureElement = child.querySelectorAll('picture');
	  if (pictureElement.length > 0) {
		pictureElement.forEach((pic, index) => {
		  if (index === 0) {
			pic.classList.add('hero-desktop');
		  } else if (index === 1) {
			pic.classList.add('hero-mobile');
		  }
		  child.className = 'hero-image';
		});
	  }
	});
  
	if (block.children.length > 1) {
	  const textBlockChildren = block.children[1];
	  textBlockChildren.className = 'hero-cta-wrapper';
	  [...textBlockChildren.children].forEach((child) => {
		child.className = 'hero-textbox';
	  });
	}
  
	const imageElements = block.querySelectorAll('img');
	imageElements.forEach((img) => {
	  img.removeAttribute('loading'); // Lighthouse recommendation: remove lazy-loading
	  img.setAttribute('loading', 'eager');
	});
}
  