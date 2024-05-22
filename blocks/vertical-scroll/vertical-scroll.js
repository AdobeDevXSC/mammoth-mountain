/**
 * loads and decorates the hero
 * @param {Element} block The hero block element
 */

export default function decorate(block) {
	const cols = [...block.children];
	cols.forEach((col) => {
		col.classList.add('vertical-scroll-item')
	});

	var items = document.querySelectorAll('.vertical-scroll-item');
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
		for (var i = 0; i < items.length; i++) {
			if (isElementInViewport(items[i])) {
				console.log('in-view');
				items[i].classList.add("in-view");
			}
		}
	}

	block.addEventListener("load", callbackFunc);
	block.addEventListener("scroll", callbackFunc);
};
