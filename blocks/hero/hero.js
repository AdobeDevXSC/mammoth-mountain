import { makeVideo } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';

export default async function decorate(block) {
  decorateIcons(block);

  const mobileImg = block.querySelector('picture');
  mobileImg.closest('.hero > div').classList.add('mobile-image-wrapper');
  
  const heroCTA = block.querySelector('h1');
  heroCTA.closest('.hero > div').classList.add('hero-cta');
  
  if (Object.values(block.classList).includes('video')) {
    const videoSrc = block.querySelector('div > a');

    if(videoSrc.href.includes(window.hlx.codeBasePath)) {
      videoSrc.href = videoSrc.text;
    }

    makeVideo(block.querySelector('div'), videoSrc.href, true);
    videoSrc.remove();
  }
}
