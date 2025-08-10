// GLOBAL VARIABLES - storing DOM elements and preferred tags
// List to append entries to
var body = null;
var DOMContainer = null // (grabbed in amm_load_recipe_list())
var searchContainer = null // (grabbed in amm_search() first time)
// Tag names for link and container of recipe entry
var templateContainerTag = null;
var templateLinkTag = null;


async function amm_load_recipe_list(template=false) {
    /* amm_load_recipe_list()
       Loads and renders all recipes from local recipes.json file into the HTML DOM,
       from tag marked with id "amm_recipe_list" */

    // Get JSON
    const recipes = await get_JSON('data/recipes.json');
    // Get list tag to append to, and strip of template
    DOMContainer = document.getElementById('amm_recipe_list');

    // Grab template, if requested
    if (template) {
	// get tags in template
	const templateContainer = document.getElementById('amm_template_recipe_item_container');
	const templateLink = document.getElementById('amm_template_recipe_link');
	
	// get the template link tagname (not optional), and remove
	if (templateLink) {
	    templateLinkTag = templateLink.tagName;
	    templateLink.remove();
	} else {  // bad template; template must always have link
	    console.log("ERROR: amm_load_recipe_list(): template: template must have provided link tag.");
	}
	
	// if a container is provided (optional), save the tagname and remove
	if (templateContainer) {
	    templateContainerTag = templateContainer.tagName;
	    templateContainer.remove();
	} else {
	    templateContainerTag = null;  // for checking (obsolete now)
	}
    }
    else { // no template, use default <li> and <a> tags
	templateLinkTag = 'a';
	templateContainerTag = 'li';
    }

    for (recipeShortname in recipes) {
	_render_listing(recipes[recipeShortname], recipeShortname);
    }
}

function _render_listing(recipeJSON, recipeShortname, container=DOMContainer) {
    // create link tag (mandatory)
    const newRecipeLink = document.createElement(templateLinkTag);
    // update <a> tag for linking
    newRecipeLink.innerText = recipeJSON.name;
    newRecipeLink.href = ('recipe/?recipe=' + recipeShortname);
    // if container specified, add to container and append to DOM
    if (templateContainerTag) {
	// create container item
	const newRecipeItem = document.createElement(templateContainerTag);
	// put link in container
	newRecipeItem.appendChild(newRecipeLink);
	// add container to DOM
	container.appendChild(newRecipeItem);
    }
    // no container, add link straight to DOM
    else { 
	container.appendChild(newRecipeLink);
    }
}

async function get_JSON(filename) {
    const response = await fetch(filename);
    const data = await response.json();
    return data;
}

function amm_toggle_search() {
    /* amm_toggle_search()
       For use with a search button that transforms into a search clear
       button. If body has "searching" class, calling calls clear_search. Otherwise,
       calling calls search()
    */

    if (body == null) {
	body = document.querySelector('body');
    }

    if (body.classList.contains('searching')) {
	amm_clear_search();
    } else {
	amm_search();
    }
}

async function amm_search() {
    // Get JSON
    const recipes = await get_JSON('data/recipes.json');
    const keywords = await get_JSON('data/keywords.json');
    // if search container hasn't been grabbed, grab
    if (searchContainer == null) {
	searchContainer = document.getElementById('amm_search_list');
    }
    // if the body hasn't been grabbed, grab
    if (body == null) {
	body = document.querySelector('body');
    }
    // Clear results box of any listings
    searchContainer.textContent = '';
    // add CSS classes
    body.classList.add('searching');
    // Get element where query entered
    const searchbar = document.getElementById('search-bar-new');
    const searchQuery = searchbar.value;
    const words = searchQuery.split(' ');
    console.log(words);

    var matchesFound = false;  // detector for whether to show empty status pagex

    for (word of words) {
	word = word.toLowerCase().trim() // standard format
	if (word in keywords) {
	    if (!matchesFound) {
		matchesFound = true;
	    }
	    const matchingShortnames = keywords[word];
	    for (shortname of matchingShortnames) {
		_render_listing(recipes[shortname], shortname, container=searchContainer);
	    }
	}
    }

    if (!matchesFound) {
	searchContainer.classList.add('amm_no_results');
    }
    console.log(matchesFound);
}

function amm_clear_search() {
    // Get objects
    const searchbar = document.getElementById('search-bar-new');
    // Clear search bar
    searchbar.value = '';
    // Swap back CSS classes
    searchContainer.classList.remove('amm_no_results'); // (if no results)
    body.classList.remove('searching');
}
