async function get_JSON(filename) {
    const response = await fetch(filename);
    const data = await response.json();
    return data;
}

function get_urlparam_name_value() {
    /* get urlparam_name_value() -> str
       Returns the shortname of the desired recipe from the URL param
       "recipe" in the current page. */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('recipe');
}

async function amm_load_recipe() {
    /* amm_load_recipe()
       Given a URL parameter of the recipe shortname, loads
       and renders the recipe to the page using latest amm spec of
       HTML amm classes (0.0). */

    // Get recipe param
    const recipeName = get_urlparam_name_value();
    console.log(recipeName);

    // Get JSON
    const recipes = await get_JSON('../data/recipes.json');
    console.log(recipes);

    // Render recipe
    // error checking
    if (!(recipeName in recipes)) {
	console.log("ERROR: _render_recipe('" + recipeName + "'): Recipe not found.");
	return;  // fail early
    }

    const recipe = recipes[recipeName];

    _render_recipe(recipe);
}

function _render_recipe(recipe) {
    /* _render_recipe(recipe)
       Loads a recipe in the current HTML DOM given JSON for the recipe.
    */

    // get_DOM_tags encapsulated to make spec changes in tag names easier
    const tags = get_DOM_tags();
    console.log(tags);

    // Name
    tags[0].innerText = recipe["name"];
    tags[1].innerText = "from " + recipe["by"];
    // Stats
    // difficulty
    tags[2][0].innerText = recipe["stats"]["dfc"] + "/5";
    // involvement
    tags[2][1].innerText = recipe["stats"]["inv"] + "/5";
    // servings
    tags[2][2].innerText = recipe["stats"]["srv"][1] + " for " + recipe["stats"]["srv"][0];
    // Ingredients
    // clear list first (handle placeholders)
    tags[3].textContent = '';
    for (var ingredItem of recipe["ingred"]) {
	const newListItem = document.createElement('li');
	newListItem.innerHTML = format_ingred(ingredItem);
	tags[3].appendChild(newListItem);
    }
    // Instructions
    // clear list first (handle placeholders)
    tags[4].textContent = '';
    for (var instrItem of recipe["instr"]) {
	const newListItem = document.createElement('li');
	newListItem.innerHTML = format_ingred(instrItem);
	tags[4].appendChild(newListItem);
    }
    // Notes
    // clear list first (placeholders)
    tags[5].textContent = '';
    for (var note of recipe["notes"]) {
	const newNote = document.createElement('p');
	newNote.innerText = note;
	tags[5].appendChild(newNote);
    }
}

function get_DOM_tags() {
    /* get_DOM_tags() -> [nameTag, ingredListTag, instrListTag]
       Gets the name, ingredients and instructions tags from HTML
       according to the latest spec (0.0), and returns as list. */
    const nameTag = document.getElementById('amm_recipe_name');
    const byTag = document.getElementById('Author');
    // Stats tags
    const dfcTag = document.getElementById('dfc-text');
    const invTag = document.getElementById('inv-text');
    const srvTag = document.getElementById('srv-text');
    // Ingredients, Instructions & Notes tags
    const ingredTag = document.getElementById('IngredList');
    const instrTag = document.getElementById('InstrList');
    const notesTag = document.getElementById('NotesList');
    return [nameTag, byTag, [dfcTag, invTag, srvTag], ingredTag, instrTag, notesTag];
}

function format_ingred(item) {
    /* Given a single ingredient with bold quantities;
       formats the given pseudo-markdown into HTML */
    var formatted = ""; // start and end <p> tag added at return

    // HANDLE QUANTITIES -- marked by bold (**)
    const parts = item.split("**");
    // if there is no quantity marking, leave alone
    if (parts.length == 1) {
	formatted += item; // current string is just text
    }
    else {  // if there is a quantity marking, format
	for (var [partIndex, part] of parts.entries()) {
	    if (part == "") {
		continue; // do nothing
	    }
	    else if (part[0] == " ") { // after md, regular text
		formatted += part;
	    }
	    else if ((part[0] != " ") && (partIndex == 0)) {
		formatted += part;
	    }
	    else { // in-md area, bold text
		formatted += '<b>' + part + '</b>';
	    }
	}
    }

    // HANDLE HIGHLIGHTS -- marked by italics (_)
    const dangerParts = formatted.split('_');
    // if there are no highlights, leave alone
    if (dangerParts.length > 1) {
	// wipe formatted; entire contents will be concat'ed by dangerParts loop
	formatted = "";
	// if there are highlights, format
	for (var [partIndex, dangerPart] of dangerParts.entries()) {
	    if (dangerPart == "") {
		continue; // do nothing
	    }
	    else if (dangerPart[0] == " ") {
		formatted += dangerPart;
	    }
	    else if ((dangerPart[0] != " ") && (partIndex == 0)) { // first part is plain text
		formatted += dangerPart;
	    }
	    else { // in-md area, highlight text
		formatted += '<mark>' + dangerPart + '</mark>';
	    }
	}
    }

    // HANDLE NOTE LINKS
    const linkStart = formatted.indexOf("[");
    if (linkStart != -1) { // if link reference (marked by []) included...
	const linkEnd = formatted.indexOf("]");
	// slice out note number (marked by int between [ ])
	const linkNum = formatted.slice(linkStart + 1, linkEnd);
	// create new link tag text
	const noteLink = "<a onclick='go_to_note(" + linkNum + ")'>See note " + linkNum + "</a>";
	// remove link reference from formatted
	formatted = formatted.slice(0, linkStart) + noteLink + formatted.slice(linkEnd + 1);
    }
    return '<p>' + formatted + '</p>'; // return includes end tag
}

function go_to_note(noteNum) {
    /* go_to_note(noteNum)
       Given the number of a note from their JSON order, highlights
       and scrolls to the note.
       WARNING: Contains reference to DOM tag not encapsulated in spec function!! */
    const targetNote = document.querySelector("#NotesList > p:nth-child(" + noteNum + ")");
    targetNote.classList.add('highlighted');
}
