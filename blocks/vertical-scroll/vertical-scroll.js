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
		icon.closest('div').classList.add(`text-block-${index + 1}`);
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
		// removes fixed block position when doc is scrolled above block
		if(getBlockPos(blockContainer).top > 0) {
			blockContainer.classList.remove('fixed');
		}

		// unfixes the block position when doc is scrolled below the block
		if(getBlockPos(blockContainer).bottom < 933) {
			blockContainer.classList.remove('fixed');
			blockContainer.classList.add('unfix');
			textBlockWrapper.style.bottom = '153px';
			textBlockWrapper.style.top = 'unset';
			console.log('unfix')
		}

		// fixes block and transition time-blockspace
		if(getBlockPos(blockContainer).top <= 0 && getBlockPos(blockContainer).bottom >= 945) {
			blockContainer.classList.add('fixed');
			blockContainer.classList.remove('unfix');

			const firstText = block.querySelector('.text-block-1');
			const secondText = block.querySelector('.text-block-2');
			const thirdText = block.querySelector('.text-block-3');

			// change text block posiiton
			// calculate change in scroll position
			const scrollTop = window.scrollY || document.documentElement.scrollTop;

			// text opacity
			const opacityScroll = (el) => {
				const maxOpacityScroll = 10; // Max scroll distance for full opacity change
				let opacity = 1 - (scrollTop / maxOpacityScroll);
				if (opacity < 0) opacity = 0; // Keep opacity within bounds
				el.style.opacity = opacity;
			}

			// Define the scroll range (adjust these values based on your content)
			const minScroll = 4750;  // The scroll position where movement starts
			const maxScroll = 8000;  // The scroll position where movement ends
		
			// Calculate the new top position between 200px and 327px
			let textTopPos = 200 + ((scrollTop - minScroll) / (maxScroll - minScroll)) * (327 - 200);

			// Clamp the value between 200px and 327px
			if(textTopPos < 200) textTopPos = 200;
			if(textTopPos > 327) textTopPos = 327;
			
			textBlockWrapper.style.top = `${textTopPos}px`;

			console.log('calc top', textTopPos)
			
			// start first transition
			if(textTopPos > 240 && textTopPos < 245) {
				console.log("change first slide")
				opacityScroll(firstText);
			}

			if(textTopPos > 300 && textTopPos < 305) {
				console.log("change second slide")
				opacityScroll(secondText);
			}

			if(textTopPos > 322 && textTopPos <= 327) {
				console.log("change third slide")
				opacityScroll(thirdText);
			}



			

		}

		console.log('block container', getBlockPos(blockContainer))
	}

	window.addEventListener("load", callbackFunc);
	window.addEventListener("scroll", callbackFunc);
};
