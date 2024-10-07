/**
 * loads and decorates the vertical scroll block
 * @param {Element} block The vertical scroll block element
 */

export default function decorate(block) {
	var blockContainer = document.querySelector('.vertical-scroll-container');

	var imageBlockWrapper = block.querySelector('div > picture').closest('div')
	imageBlockWrapper.classList.add('image-block-wrapper');

	// create one wrapper div for text blocks
	const textBlockWrapper = document.createElement('div');
	textBlockWrapper.classList.add('text-block-wrapper')
	const textBlocks = [...block.children].splice(0, 4);

	textBlocks.forEach((row) => {
		[...row.children].forEach((col) => {
			textBlockWrapper.append(col);
		});
		row.remove();
	});

	imageBlockWrapper.append(textBlockWrapper);
	
	// update class name for individual text slides
	const textIcons = block.querySelectorAll('p > picture');
	textIcons.forEach((icon, index) => {
		icon.closest('div').classList.add(`text-block-${index}`);
		icon.closest('div').classList.add('text-block');
	})

	// manage image classes
	const pics = block.querySelectorAll('div > picture');
	pics.forEach((pic, index) => {
		pic.classList.add('vertical-scroll-item');
		pic.classList.add(`trigger-${index + 1}`);
	});





	function getBlockPos(el){
		var rect = el.getBoundingClientRect();
		return (
			{'top': rect.top, 'bottom': rect.bottom}
		);
	}


	// function isElementInViewport(el) {
	// 	var rect = el.getBoundingClientRect();
	// 	return (
	// 		rect.top >= 0 &&
	// 		rect.left >= 0 &&
	// 		rect.bottom <=
	// 			(window.innerHeight || document.documentElement.clientHeight) &&
	// 		rect.right <=
	// 			(window.innerWidth || document.documentElement.clientWidth)
	// 	);
	// }
	
	function callbackFunc() {

		// sets block position to fixed
		if(getBlockPos(blockContainer).top < 0){
			blockContainer.classList.add('fixed');
			blockContainer.classList.remove('unfix');
		}

		if(getBlockPos(blockContainer).top > 0) {
			blockContainer.classList.remove('fixed');
		}

		if(getBlockPos(blockContainer).bottom < 653) {
			blockContainer.classList.remove('fixed');
			blockContainer.classList.add('unfix');
		}

		if(getBlockPos(blockContainer).top <= 0 && getBlockPos(blockContainer).top >= -3955) {
			console.log("do some stuff")




			// opacity
			// const element = document.querySelector('.your-element'); // Replace with your element
			// const scrollTop = window.screenY || document.documentElement.scrollTop;
			// const maxScroll = 500; // Max scroll distance for full opacity change
			
			// let opacity = 1 - (scrollTop / maxScroll);
			// if (opacity < 0) opacity = 0; // Keep opacity within bounds
			
			// element.style.opacity = opacity;

		}

		console.log('block container', getBlockPos(blockContainer))
	}

	window.addEventListener("load", callbackFunc);
	window.addEventListener("scroll", callbackFunc);
};
