/**
 * loads and decorates the vertical scroll block
 * @param {Element} block The vertical scroll block element
 */

export default function decorate(block) {
	// pictures
	const pics = block.querySelectorAll('div > picture');

	pics.forEach((pic, index) => {
		// pic.classList.add('vertical-scroll-item');
		// pic.classList.add(`trigger-${index + 1}`);
		pic.closest('div').classList.add('image-wrapper');
	});

	// text portion of the slide 
	const textIcons = block.querySelectorAll('p > picture');
	textIcons.forEach((icon) => {
		icon.closest('div').classList.add('text-wrapper')
	})


	// ground control code
	// JS for Navbar hide/show on scroll

	// var prevScrollpos = window.scrollY;
	// window.onscroll = function () {
	// 	var currentScrollPos = Math.max(window.scrollY, 0);
	// 	if (currentScrollPos - prevScrollpos <= 0 ) {
	// 		document.getElementById("nav-bar").style.top = "0";
	// 	} else {
	// 		document.getElementById("nav-bar").style.top = "-80px";
	// 	}
	// 	prevScrollpos = currentScrollPos;
	// };




	// classname toggle functions 
	var blockContainer = document.querySelector('.vertical-scroll-container');
	console.log("container", blockContainer);

	// var scrollItems = document.querySelectorAll('.vertical-scroll > div');
	// scrollItems.forEach((item, idx) => {
	// 	item.classList.add('scroll-slide')
	// 	item.classList.add(`scroll-slide-${idx + 1}`)
	// });

	function getBlockPos(el){
		var rect = el.getBoundingClientRect();
		return (
			{'top': rect.top, 'bottom': rect.bottom}
		);
	}

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
		// sets block position
		if(getBlockPos(blockContainer).top < 0){
			blockContainer.classList.add('fixed');
		}

		if(getBlockPos(blockContainer).bottom < 0){
			blockContainer.classList.remove('fixed');
		}

		console.log(getBlockPos(blockContainer))

		// for (var i = 0; i < scrollItems.length; i++) {
		// 	if (isElementInViewport(scrollItems[i])) {
		// 		console.log('in-view', scrollItems[i]);
		// 		scrollItems[i].classList.add('in-view');
		// 	} else {
		// 		scrollItems[i].classList.add('not-in-view');
		// 	}
		// }
	}

	window.addEventListener("load", callbackFunc);
	window.addEventListener("scroll", callbackFunc);
};
