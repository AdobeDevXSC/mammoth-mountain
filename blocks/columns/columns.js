import { makeVideo } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

	  // add video option
	  if (Object.values(block.classList).includes('video')) {
		const videoSrc = block.querySelector('div > a');

		if(videoSrc.href.includes(window.hlx.codeBasePath)) {
		videoSrc.href = videoSrc.text;
		}

		makeVideo(videoSrc.closest('div'), videoSrc.href, true);
		videoSrc.remove();

		const video = block.querySelector('video')
		const videoWrapper = video.closest('div');
		videoWrapper.classList.add('video-wrapper');
	}

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
	  const linkedPic = col.querySelector('a > picture');

	  if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

	  if (linkedPic) {
        const linkedPicWrapper = pic.closest('div');
		linkedPicWrapper.className = "linked-image-wrapper"
      }
    });
  });
}
