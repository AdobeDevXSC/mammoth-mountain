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
	const allTextBlocks = [...block.children].splice(0, 4);

	allTextBlocks.forEach((row) => {
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
		pic.classList.add(`image-${index + 1}`);
	});

	function getBlockPos(el){
		var rect = el.getBoundingClientRect();
		return (
			{'top': rect.top, 'bottom': rect.bottom}
		);
	}
	
	function callbackFunc() {
		// removes fixed block position when doc is scrolled above block
		if(getBlockPos(blockContainer).top > 0) {
			blockContainer.classList.remove('fixed');
		}

		// scroll reaches bottom of block
		// unfixes the block position when doc is scrolled below the block
		if(getBlockPos(blockContainer).bottom < 933) {
			blockContainer.classList.remove('fixed');
			blockContainer.classList.add('unfix');
			textBlockWrapper.style.bottom = '153px';
			textBlockWrapper.style.top = 'unset';
		}
		
		let lastScrollTop = 0;
		
		// fixes block and transition time-blockspace
		if(getBlockPos(blockContainer).top <= 0 && getBlockPos(blockContainer).bottom >= 945) {
			blockContainer.classList.add('fixed');
			blockContainer.classList.remove('unfix');

			// calculate change in scroll position
			let scrollTop = window.scrollY || document.documentElement.scrollTop;

			let scrollDown = scrollTop > lastScrollTop;
	
			// change text block position on scroll
			// Define the scroll range
			const minScroll = 4750;  // The scroll position where movement starts
			const maxScroll = 8000;  // The scroll position where movement ends
		
			// Calculate the new top position between 200px and 327px
			let textTopPos = 200 + ((scrollTop - minScroll) / (maxScroll - minScroll)) * (327 - 200);

			// Clamp the value between 200px and 327px
			textTopPos = Math.min(Math.max(textTopPos, 200), 327);
			
			textBlockWrapper.style.top = `${textTopPos}px`;

			
			// opacity adjustment on scroll functions
			const opacityScrollDown = (el, downTrigger, opacityMax) => {
				let opacity;
				let zIndex;

				// Check if scrolling down and past the down trigger point
				if (textTopPos > downTrigger) {
					opacity = 1 - ((textTopPos - downTrigger) / opacityMax);
					if (opacity < 0) {
						opacity = 0; // Ensure opacity does not go below 0
						zIndex = -1;
					}
				}

				el.style.opacity = opacity;
				el.style.zIndex = zIndex;
			};

			const opacityScrollUp = (el, upTrigger, opacityMax) => {
				let opacity;
				let zIndex;

				// Check if scrolling up and below the up trigger point
				if (textTopPos < upTrigger) {
					opacity = ((upTrigger - textTopPos) / opacityMax);
					if (opacity > 1) opacity = 1; // Ensure opacity does not exceed 1
					if(opacity > 0.2) zIndex = 6;
				}

				el.style.opacity = opacity;
			}

			const maxOpacityScrollText = 10;
			const maxOpacityScrollImage = 0;

			const loopEls = (parentEl, triggerPoints) => {
				for (let i = 0; i < 3; i++) {
					let el = parentEl[i];
					let triggerPoint = triggerPoints[i];
	
					if (textTopPos > triggerPoint && scrollDown) {
						opacityScrollDown(el, triggerPoint, maxOpacityScrollText)
					} else if (textTopPos < triggerPoint) {
						console.log("scrolling up", scrollDown, triggerPoint, textTopPos)
						opacityScrollUp(el, triggerPoint, maxOpacityScrollText)
					}
					
					// Update last scroll position
					lastScrollTop = textTopPos <= 0 ? 0 : textTopPos;
				};
			}


			const allTextBlocks = Array.from(block.querySelectorAll(".text-block"));
			const textTriggers = [ 245, 295, 325 ]

			// call looping function for text blocks
			loopEls(allTextBlocks, textTriggers);

			// call looping function for image blocks






			// code that works for opacity transitions

			// const firstText = block.querySelector('.text-block-1');
			// const secondText = block.querySelector('.text-block-2');
			// const thirdText = block.querySelector('.text-block-3');

			
			// // start first text transition
			// if(textTopPos > 240 && textTopPos < 245) {
			// 	console.log("change first slide")
			// 	opacityScroll(firstText);
			// }

			// // start second text transition
			// if(textTopPos > 300 && textTopPos < 305) {
			// 	console.log("change second slide")
			// 	opacityScroll(secondText);
			// }

			// // start third text transition
			// if(textTopPos > 322 && textTopPos <= 327) {
			// 	console.log("change third slide")
			// 	opacityScroll(thirdText);
			// }
		}
	}

	window.addEventListener("load", callbackFunc);
	window.addEventListener("scroll", callbackFunc);
};
