/**
 * loads and decorates the hero
 * @param {Element} block The hero block element
 */

export default function decorate(block) {
	const cols = [...block.children];
	cols.forEach((col, index) => {
		col.classList.add('vertical-scroll-item')
		col.classList.add(`trigger-${index + 1}`)
		var image = col.children[1];
		var textBoxes = col.children[0];
		textBoxes.classList.add('text-container')
	});

	var items = document.querySelectorAll('.vertical-scroll-item');
	console.log('items', items);
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

	window.addEventListener("scroll", function (event) {
        let scroll_y = this.scrollY;
        console.log('scroll position', scroll_y);
	})

	window.addEventListener("load", callbackFunc);
	window.addEventListener("scroll", callbackFunc);

};
