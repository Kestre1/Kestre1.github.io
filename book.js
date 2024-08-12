// HELPER FUNCTIONS //
async function getJSON(filename) {
    const response = await fetch(filename);
    const data = await response.json();
    return data;
}

function getRandomInt(min, max, skip=null) {
    var number = skip;  // so loop runs once
    while (skip == number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	number =  Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return number;
}

// MAIN FUNCTION //
async function get_verse() {
    /* get_verse()
       Loads a verse of the Book of Alice from JSON and displays
       it in DOM.
    */

    // get JSON
    const book = await getJSON('alice.json');
    // get DOM elements
    const verseTag = document.getElementById('verse');
    const citeTag = document.getElementById('citation');
    // get last verse number picked
    const lastVerseIndex = localStorage['verseIndex'];
    // pick random number between 0 and number of book entries, excluding last
    const verseIndex = getRandomInt(0, book.length - 1, skip=lastVerseIndex);
    // set the verse to the one with the chosen index;
    verseTag.innerText = book[verseIndex];
    // set the citation to random numbers
    citation.innerText = getRandomInt(1,9) + ':' + getRandomInt(1,89);

    // cache verse index so it won't be repeated
    localStorage['verseIndex'] = verseIndex.toString();

    // 1 in 50 chance to get a gay background
    const gayChance = getRandomInt(0, 50);
    console.log(gayChance);
    if (gayChance == 24) {
	document.querySelector('body').classList.add('gay');
    }
}
    
    
