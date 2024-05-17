import {
	sampleRUM,
	buildBlock,
	loadHeader,
	loadFooter,
	decorateButtons,
	decorateIcons,
	decorateSections,
	decorateBlocks,
	decorateTemplateAndTheme,
	waitForLCP,
	loadBlocks,
	loadCSS,
	getMetadata,
	decorateBlock,
	loadBlock,
	loadScript, 
	toCamelCase,
	toClassName,
  } from './aem.js';
  
  // Define an execution context
  const pluginContext = {
	getAllMetadata,
	getMetadata,
	loadCSS,
	loadScript,
	sampleRUM,
	toCamelCase,
	toClassName,
  };

const LCP_BLOCKS = [
	'hero'
]; // add your LCP blocks to the list

const AUDIENCES = {
	mobile: () => window.innerWidth < 600,
	desktop: () => window.innerWidth >= 600,
	// define your custom audiences here as needed
  };
  
  export function getAllMetadata(scope) {
	return [...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)]
	  .reduce((res, meta) => {
		const id = toClassName(meta.name
		  ? meta.name.substring(scope.length + 1)
		  : meta.getAttribute('property').split(':')[1]);
		res[id] = meta.getAttribute('content');
		return res;
	  }, {});
  }
  
  window.hlx.plugins.add('experimentation', {
	condition: () => getMetadata('experiment')
	  || Object.keys(getAllMetadata('campaign')).length
	  || Object.keys(getAllMetadata('audience')).length,
	options: { audiences: AUDIENCES, prodHost: 'experimentation--xsc-wknd--hlxsites.hlx.page' },
	url: '/plugins/experimentation/src/index.js',
  });
  
  // Define the custom audiences mapping for experimentation
  const EXPERIMENTATION_CONFIG = {
	audiences: {
	  device: {
		mobile: () => window.innerWidth < 600,
		desktop: () => window.innerWidth >= 600,
	  },
	  visitor: {
		new: () => !localStorage.getItem('franklin-visitor-returning'),
		returning: () => !!localStorage.getItem('franklin-visitor-returning'),
	  },
	},
  };

  /**
 * Determine if we are serving content for the block-library, if so don't load the header or footer
 * @returns {boolean} True if we are loading block library content
 */
export function isBlockLibrary() {
	return window.location.pathname.includes('block-library');
  }
  
  /**
   * TODO: Update
   * @param {*} element
   * @param {*} href
   */
  export function addVideo(element, href) {
	element.innerHTML = `<video loop muted playsInline>
	  <source data-src="${href}" type="video/mp4" />
	</video>`;
	const video = element.querySelector('video');
	const source = element.querySelector('video > source');
  
	source.src = source.dataset.src;
	video.load();
	video.addEventListener('loadeddata', () => {
	  video.setAttribute('autoplay', true);
	  video.setAttribute('data-loaded', true);
	  video.play();
	});
  }

  /**
 * Convience method for creating tags in one line of code
 * @param {string} tag Tag to create
 * @param {object} attributes Key/value object of attributes
 * @param {HTMLElement | HTMLElement[] | string} children Child element
 * @returns {HTMLElement} The created tag
 */
export function createTag(tag, attributes, children) {
	const element = document.createElement(tag);
	if (children) {
	  if (children instanceof HTMLElement
		|| children instanceof SVGElement
		|| children instanceof DocumentFragment) {
		element.append(children);
	  } else if (Array.isArray(children)) {
		element.append(...children);
	  } else {
		element.insertAdjacentHTML('beforeend', children);
	  }
	}
	if (attributes) {
	  Object.entries(attributes).forEach(([key, val]) => {
		element.setAttribute(key, val);
	  });
	}
	return element;
  }

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function autolinkModals(element) {
	element.addEventListener('click', async (e) => {
	  const origin = e.target.closest('a');
  
	  if (origin && origin.href && origin.href.includes('/modals/')) {
		e.preventDefault();
		const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
		openModal(origin.href);
	  }
	});
  }

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
	const link = document.createElement('link');
	link.rel = 'icon';
	link.type = 'image/svg+xml';
	link.href = href;
	const existingLink = document.querySelector('head link[rel="icon"]');
	if (existingLink) {
	  existingLink.parentElement.replaceChild(link, existingLink);
	} else {
	  document.getElementsByTagName('head')[0].appendChild(link);
	}
  }

  const tabElementMap = {};

function calculateTabSectionCoordinate(main, lastTabBeginningIndex, targetTabSourceSection) {
  if (!tabElementMap[lastTabBeginningIndex]) {
    tabElementMap[lastTabBeginningIndex] = [];
  }
  tabElementMap[lastTabBeginningIndex].push(targetTabSourceSection);
}

function calculateTabSectionCoordinates(main) {
  let lastTabIndex = -1;
  let foldedTabsCounter = 0;
  const mainSections = [...main.childNodes];
  main
    .querySelectorAll('div.section[data-tab-title]')
    .forEach((section) => {
      const currentSectionIndex = mainSections.indexOf(section);

      if (lastTabIndex < 0 || (currentSectionIndex - foldedTabsCounter) !== lastTabIndex) {
        // we construct a new tabs component, at the currentSectionIndex
        lastTabIndex = currentSectionIndex;
        foldedTabsCounter = 0;
      }

      foldedTabsCounter += 2;
      calculateTabSectionCoordinate(main, lastTabIndex, section);
    });
}

async function autoBlockTabComponent(main, targetIndex, tabSections) {
  // the display none will prevent a major CLS penalty.
  // franklin will remove this once the blocks are loaded.
  const section = document.createElement('div');
  section.setAttribute('class', 'section');
  section.setAttribute('style', 'display:none');
  section.dataset.sectionStatus = 'loading';
  const tabsBlock = document.createElement('div');
  tabsBlock.setAttribute('class', 'tabs');

  const tabContentsWrapper = document.createElement('div');
  tabContentsWrapper.setAttribute('class', 'contents-wrapper');

  tabsBlock.appendChild(tabContentsWrapper);

  tabSections.forEach((tabSection) => {
    tabSection.classList.remove('section');
    tabSection.classList.add('contents');
    // remove display: none
    tabContentsWrapper.appendChild(tabSection);
    tabSection.style.display = null;
  });
  main.insertBefore(section, main.childNodes[targetIndex]);
  section.append(tabsBlock);
  decorateBlock(tabsBlock);
  await loadBlock(tabsBlock);
  // unset display none manually.
  // somehow in some race conditions it won't be picked up by lib-franklin.
  // CLS is not affected
  section.style.display = null;
}

function aggregateTabSectionsIntoComponents(main) {
  calculateTabSectionCoordinates(main);

  // when we aggregate tab sections into a tab autoblock, the index get's lower.
  // say we have 3 tabs starting at index 10, 12 and 14. and then 3 tabs at 18, 20 and 22.
  // when we fold the first 3 into 1, those will start at index 10. But the other 3 should now
  // start at 6 instead of 18 because 'removed' 2 sections.
  let sectionIndexDelta = 0;
  Object.keys(tabElementMap).map(async (tabComponentIndex) => {
    const tabSections = tabElementMap[tabComponentIndex];
    await autoBlockTabComponent(main, tabComponentIndex - sectionIndexDelta, tabSections);
    sectionIndexDelta = tabSections.length - 1;
  });
}



/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
	document.documentElement.lang = 'en';
	decorateTemplateAndTheme();

	if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
	  document.body.classList.add('breadcrumbs-enabled');
	}

	// Add below snippet early in the eager phase
	if (getMetadata('experiment')
	|| Object.keys(getAllMetadata('campaign')).length
	|| Object.keys(getAllMetadata('audience')).length) {
	// eslint-disable-next-line import/no-relative-packages
	const { loadEager: runEager } = await import('../plugins/experimentation/src/index.js');
	await runEager(document, { audiences: AUDIENCES }, pluginContext);
	}

    await window.hlx.plugins.run('loadEager', pluginContext);

	window.adobeDataLayer = window.adobeDataLayer || [];

	let pageType = 'CMS';
	if (document.body.querySelector('main .product-details')) {
	pageType = 'Product';
	} else if (document.body.querySelector('main .product-list-page')) {
	pageType = 'Category';
	} else if (document.body.querySelector('main .commerce-cart')) {
	pageType = 'Cart';
	} else if (document.body.querySelector('main .commerce-checkout')) {
	pageType = 'Checkout';
	}
	window.adobeDataLayer.push({
	pageContext: {
		pageType,
		pageName: document.title,
		eventType: 'visibilityHidden',
		maxXOffset: 0,
		maxYOffset: 0,
		minXOffset: 0,
		minYOffset: 0,
	},
	});

	const main = doc.querySelector('main');
	if (main) {
	  decorateMain(main);
	  document.body.classList.add('appear');
	  await waitForLCP(LCP_BLOCKS);
	}
  
	try {
	  /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
	  if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
		loadFonts();
	  }
	} catch (e) {
	  // do nothing
	}
  }

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();