// HELPER FUNCTIONS //
async function getJSON(filename) {
    const response = await fetch(filename);
    const data = await response.json();
    return data;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// MAIN FUNCTION //
async function get_verse() {
    /* get_verse()
       Loads a verse of the Book of Alice from JSON and displays
       it in DOM.
    */

    const book = await getJSON('alice.json');
    console.log(book);
    const verseTag = document.getElementById('verse');
    const citeTag = document.getElementById('citation');
    // pick random number between 0 and number of book entries
    const verseIndex = getRandomInt(0,book.length - 1);
    // set the verse to the one with the chosen index;
    verseTag.innerText = book[verseIndex];
    // set the citation to random numbers
    citation.innerText = getRandomInt(1,9) + ':' + getRandomInt(1,89);
}
    
    
