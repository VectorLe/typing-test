/*
This is a vanilla JavaScript program to control logic for a typing test game.

- Starting state:
  - Initiate countdown and display prompt
  - Autofocus to input

- Testing state:
  - Countdown begins. Listen for every input
  - With each letter of the prompt, check if letter of input matches
    - If match, increase index so that "current letter" of prompt goes next
  - Reset upon Esc
  - Every time space is pressed, clear input
  - With each mistake, count it
  - Handle backspaces

- Completion state:
  - Clear input, clear prompt, clear current WPM
  - Calculate WPM: (correctChars / 5) / (timeInMinutes) and display total WPM
  - Try again button
*/

// Declare global variables
const prompt = document.querySelector(".prompt");
const input = document.querySelector("input");
const wpm = document.querySelector("#WPM");
const timer = document.querySelector("#Timer");
const totalTime = 10;
let correctCharacters = 0;

// ---------- Helper Functions ----------
// initTimer(), wrapPromptChars(), blinkRed(letter)

/* 
	Set initial timer value and countdown in setInterval
	- If timer reachers 3s left, change to red color
	- If time runs out, replace prompt with message and break out of setInterval
*/
function initTimer() {
	let timeRemaining = totalTime;
	timer.innerHTML = timeRemaining;

	/*
	 Every second:
	 - Decrement the time remaining
	 - Calculate WPM
	 - Decay WPM if user slows down or stops typing
	 - Check if time is running out (3s left) to change style
	 - Check if timer has completed
	*/
	const interval = setInterval(function(){
		timeRemaining--;
		timer.innerHTML = timeRemaining;
		wpm.innerHTML = Math.round((correctCharacters / 5) / (totalTime / 60));

		if(correctCharacters > 0) correctCharacters--;

		if(timeRemaining === 3) timer.style.color = "red";
		
		// Jump to completion state
		if(timeRemaining === 0) {
			prompt.innerHTML = '<span style="color: red;">No more time!</span>';
			clearInterval(interval);
		}
	}, 1000);
}

// Convert prompt text each letter of the prompt in <span> tags
function wrapPromptChars() {
	let promptArr = prompt.textContent.split("");
	for(let i = 0; i < promptArr.length; i++) {
		promptArr[i] = '<span class="letter">' + promptArr[i] + '</span>';
	}
	prompt.innerHTML = promptArr.join("");
}

function blinkRed(letter) {
	setTimeout(function() {
		letter.style.backgroundColor = "red";
		setTimeout(function() {
			letter.style.backgroundColor = "";
			setTimeout(function() {
				letter.style.backgroundColor = "red";
			}, 50);
		}, 50);
	}, 50);
}

// ---------- Primary Core Functions ----------
// fillPrompt(), trackInput()

// Fill in the prompt field
function fillPrompt() {
	const promptText = "The quick brown fox jumps over the lazy dog again and again, while bright haze muffles wild chirps from jungle trees below.";

	prompt.textContent = promptText;

	wrapPromptChars();
}

// Tracks the state of the current letter and tracks user inputs
function trackInput() {
	let currentIndex = 0;
	let letterSpans = document.querySelectorAll(".letter");
	let currentLetter = letterSpans[currentIndex];

	currentLetter.style.backgroundColor = "lime";
	console.log("The current letter is: " + currentLetter.innerHTML);

	// Sets current letter to the array's index background to green
	function setCurrentLetter() {
		currentLetter = letterSpans[currentIndex];
		currentLetter.style.backgroundColor = "lime";
	}
	
	// Listen for user inputs
	input.addEventListener("input", onInput);
	input.addEventListener("keydown", handleSpecialKeys);

	/* 
		Each time user inputs, check if input == currentLetter
		- If match, 
			- Increment correctCharacters
			- Reset letter's background and grey out
			- Increment to next index of the prompt 
			- Make the new current letter green
		- If not match, the current letter blinks red.
	*/
	function onInput(e) {
		console.log("User Input: " + e.target.value);

		// Correct key entered
		if((e.target.value) === currentLetter.innerHTML) {
			console.log("Correct key entered.");
			correctCharacters++;
			currentLetter.style.color = "#222";
			currentLetter.style.backgroundColor = "";
			currentIndex++;
			setCurrentLetter();

			// Start countdown after first keypress
			if(currentIndex === 1) 	initTimer();
		} 
		// Wrong key entered
		else {
			blinkRed(currentLetter)
			
			console.log("Wrong key entered.");
		}
		
		e.target.value = "";	
		console.log("The current letter is: " + currentLetter.innerHTML);
	}

	// Listens for special keys pressed: Backspace, ESC
	function handleSpecialKeys(e) {
		/* 
			Handles Backspace key
			- Reset letter's style
			- Decrement current letter's index
		*/
		if(e.key === "Backspace" && currentIndex > 0 && (letterSpans[currentIndex - 1].innerHTML !== " ")) {
			console.log("Backspace pressed");
			currentLetter.style.backgroundColor = "";
			currentLetter.style.color = "white";
			currentIndex--;
			setCurrentLetter();
			console.log("The current letter is: " + currentLetter.innerHTML);
		}
		// Handles ESC key: resets current letter to beginning
		// if (event.key === 'Escape' || event.keyCode === 27) {
		// 	console.log("ESC pressed");
		// 	currentIndex = 0;
		// 	currentLetter = letterSpans[currentIndex];
		// }
	}
}

// High level function calls

// Starting State
// Get user inputted settings: time to play.
fillPrompt();

// Testing State
// Calculate accuracy
// Create a graph of speed over time
trackInput();

// Completion State
// Ask user to restart or listen for ESC input to automatically restart