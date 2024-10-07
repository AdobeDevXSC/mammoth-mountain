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


// JS for timeline animation
// var items = document.querySelectorAll(".timeline-item");

// function isElementInViewport(el) {
//     var rect = el.getBoundingClientRect();
//     return (
//         rect.top >= 0 &&
//         rect.left >= 0 &&
//         rect.bottom <=
//             (window.innerHeight || document.documentElement.clientHeight) &&
//         rect.right <=
//             (window.innerWidth || document.documentElement.clientWidth)
//     );
// }

// function callbackFunc() {
//     for (var i = 0; i < items.length; i++) {
//         if (isElementInViewport(items[i])) {
//             items[i].classList.add("in-view");
//         }
//     }
// }

// window.addEventListener("load", callbackFunc);
// window.addEventListener("scroll", callbackFunc);



	function isElementInViewport(el) {
		var rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <=
				(window.innerWidth || document.documentElement.clientWidth)
		);
	}



	
	function callbackFunc() {

		// sets block position to fixed
		if(getBlockPos(blockContainer).top < 0){
			blockContainer.classList.add('fixed');
			blockContainer.classList.remove('unfix');
		}

		if(getBlockPos(blockContainer).top > 0) {
			blockContainer.classList.remove('fixed');
		}

		if(getBlockPos(blockContainer).bottom < 500) {
			blockContainer.classList.remove('fixed');
			blockContainer.classList.add('unfix');
		}

		// if(getBlockPos(blockContainer).bottom > 500) {
		// 	blockContainer.classList.remove('unfix');
		// }

		console.log('block container', getBlockPos(blockContainer))
		console.log("text-wrapper", getBlockPos(textBlockWrapper).top)

		if(getBlockPos(textBlockWrapper) <= 210){

		}
	}

	window.addEventListener("load", callbackFunc);
	window.addEventListener("scroll", callbackFunc);
};
