/**
 * loads and decorates the hero
 * @param {Element} block The hero block element
 */

export default function decorate(block) {
	const pics = block.querySelectorAll('div > picture');

	pics.forEach((pic, index) => {
		pic.classList.add('vertical-scroll-item');
		pic.classList.add(`trigger-${index + 1}`);
		pic.closest('div').classList.add('image-wrapper');
	});

	const textIcons = block.querySelectorAll('p > picture');
	textIcons.forEach((icon) => {
		icon.closest('div').classList.add('text-wrapper')
	})

	var blockContainer = document.querySelector('.vertical-scroll');
	console.log("container", blockContainer);

	var scrollItems = document.querySelectorAll('.vertical-scroll > div');

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
		for (var i = 0; i < scrollItems.length; i++) {
			if (isElementInViewport(scrollItems[i])) {
				console.log('in-view', scrollItems[i]);
				scrollItems[i].classList.add("in-view");
			}
		}
	}

	window.addEventListener("load", callbackFunc);
	window.addEventListener("scroll", callbackFunc);
};
