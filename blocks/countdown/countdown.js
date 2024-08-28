/**
 * loads and decorates the countdown timer block
 * @param {Element} block The countdown timer block element
 */

export default async function decorate(block) {
	const dateWrapper = block.querySelector('div')
	const targetDate = dateWrapper.children[0].innerHTML;

	dateWrapper.innerHTML = `
		<div class="countdown-numbers-wrapper">
			<div class="days">
				<h5>Days</h5>
				<p id="days"></p>
			</div>
			<div class="hours">
				<h5>Hours</h5>
				<p id="hours"></p>
			</div>
			<div class="minutes">
				<h5>Minutes</h5>
				<p id="minutes">
				</p>
			</div>
			<div class="seconds">
				<h5>Seconds</h5>
				<p id="seconds"></p>
			</div>
		</div>
	`

	function countdown(endDate) {
		let days, hours, minutes, seconds;	
		endDate = new Date(endDate).getTime();
		
		if (isNaN(endDate)) {
		  return;
		}
		
		setInterval(calculate, 1000);
		
		function calculate() {
		  let startDate = new Date().getTime(); 
		  let timeRemaining = parseInt((endDate - startDate) / 1000);
		  
		  if (timeRemaining >= 0) {
			days = parseInt(timeRemaining / 86400);
			timeRemaining = (timeRemaining % 86400);
			
			hours = parseInt(timeRemaining / 3600);
			timeRemaining = (timeRemaining % 3600);
			
			minutes = parseInt(timeRemaining / 60);
			timeRemaining = (timeRemaining % 60);
			
			seconds = parseInt(timeRemaining);
			
			document.getElementById("days").innerHTML = days < 10 ? `<div><span>0</span></div><div><span>${days}</span></div>` : `<div><span>${parseInt(days / 10)}</span></div><div><span>${days % 10}</span></div>`;
			document.getElementById("hours").innerHTML = hours < 10 ? `<div><span>0</span></div><div><span>${hours}</span></div>` : `<div><span>${parseInt(hours / 10)}</span></div><div><span>${hours % 10}</span></div>`;
			document.getElementById("minutes").innerHTML = minutes < 10 ? `<div><span>0</span></div><div><span>${minutes}</span></div>` : `<div><span> ${parseInt(minutes / 10)}</span></div><div><span>${minutes % 10}</span></div>`;
			document.getElementById("seconds").innerHTML = seconds < 10 ? `<div><span>0</span></div><div><span>${seconds}</span></div>` : `<div><span> ${parseInt(seconds / 10)}</span></div><div><span>${seconds % 10}</span></div>`;
		  } else {
			return;
		  }
		}
	}

(countdown(targetDate));
}

