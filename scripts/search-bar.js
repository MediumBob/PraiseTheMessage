/* ****************** */
// Variables
/* ****************** */

const INPUT_BOX = document.getElementById("input-box");                         // the serach bar's input box
const AUTOCOMPLETE_RESULTS = document.querySelector(".autocomplete-box");       // the search bar's autocomplete box (that lists the avaialbe terms)
const SEARCH_ICON = document.querySelector(".fa-solid.fa-magnifying-glass");    // the search bar's "serach" icon (the magnifying glass)                                                     // is the search bar behavior toggled?
const GAME_DROPDOWN = document.getElementById("game-dropdown");                 // the dropdown menu to select a game
const BEHAVIOR_DROPDOWN = document.getElementById("search-behavior-dropdown");  // the dropdown menu to select the search behavior
const TERMS_CONTAINER = document.querySelector(".terms-container");             // the container with all the categories
const RESULT_BOX = document.querySelector(".result-box")                        // the container for the result (below the search bar)
let behaviorToggle = false;                                                     // is the search bar behavior toggled? (true="contains", false="matches"
let activeItemIndex = -1;                                                       // which item is highlighted in the autocomplete menu?
let selectedGame = GAME_DROPDOWN.value;                                         // the currently selected game
let terms = {}                                                                  // the json data from the remote repo
let images = document.querySelectorAll(".background");                          // all our background images
let imageIndex = 0;                                                             // which background image are we showing?

/* ****************** */
// Executed code
/* ****************** */

SwapGame(selectedGame);

/* ****************** */
// Event listeners
/* ****************** */

// Search icon was clicked
SEARCH_ICON.addEventListener('click', function() {
    SelectInput(INPUT_BOX.value);
});

// Screen was clicked (somewhere)
document.addEventListener('click', (event) =>{
    // leave the autocomplete menu showing if the user clicked on the input box or the dropdown menu for search behavior
    if (!(event.target === INPUT_BOX) && !(event.target === BEHAVIOR_DROPDOWN) 
        && !(((event.target.tagName === 'OPTION' && event.target.parentNode == GAME_DROPDOWN)))){
        // if the click was anywhere else on the page, we remove the autocomplete results
        HideOptions(AUTOCOMPLETE_RESULTS);
    }
    // update the autocomplete results when changing search behavior
    if ((event.target.tagName === 'OPTION' && event.target.parentNode == BEHAVIOR_DROPDOWN) && INPUT_BOX){
        UpdateSearchBar();
    }
});

// Search bar focused
INPUT_BOX.addEventListener("focus", UpdateSearchBar);

// Input added to search bar
INPUT_BOX.addEventListener("input", UpdateSearchBar);
   
// Key-down event
INPUT_BOX.onkeydown = function(event){
    let listItems = document.querySelectorAll('.autocomplete-box ul li');
    UpdateAutocompleteHighlight(event, listItems);
}

/* ****************** */
// Function definitions
/* ****************** */

/** SelectInput
 * Executes when the user runs the search bar by either clicking an autocomplete 
 * selection, clicking the search icon, or pressing the enter key.
 * @param {string} userSelection - the term being searched for
 */
function SelectInput(userSelection){
    let searchTerm;
    // grab the term we are searching for
    if (userSelection instanceof Element){
        // term being searched for is not a string - grab the text from this DOM object
        searchTerm = userSelection.innerHTML;
    }
    else{
        // term being searched for is a string - use it directly
        searchTerm = userSelection;
    }
    // check which JSON keys map to the provided value (ex: knight is listed under "enemies" and also "people"; we want to list both)
    let keys = Search(searchTerm);
    // show the answer(s) in the result box
    ShowResult(keys, searchTerm);
    // update the term listed in the search box
    INPUT_BOX.value = searchTerm;
    // hide the autocomplete box
    HideOptions(AUTOCOMPLETE_RESULTS);
    // highlight the appropriate category of terms
    HighlightDiv(searchTerm);
    // clear the active item
    activeItemIndex = -1;
 }

 
 /** Search
  * Checks the JSON data for which keys map to the provided value
  * @param {string} searchTerm - the value being searched for
  * @returns array of all keys that map to the given value
  */
 function Search(searchTerm) {
    let keys = [];
    let found;
    // check every value in our JSON data for any matching keys
    for (let [key, value] of Object.entries(terms)) { //NOTE: the terms variable holds our json data
        // search behavior is toggled
        if (behaviorToggle){
            // searching for terms that contain the searchTerm
            found = value.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // search behavior is not toggled
        else{
            // searching for terms that exactly match the searchTerm
            found = value.some(item => item.toLowerCase() === searchTerm.toLowerCase());
        }
        if (found) {
            keys.push(key);
        }
    }
    // return the matching keys, or an empty array if nothing matched
    return keys
 }

 
 /** PopulateAutocompleteBox
  * Changes the options displayed in the autocomplete box based on user input
  * @param {Array} result - all the terms we want displayed in the autocomplete box (this argument will include duplicate terms)
  */
 function PopulateAutocompleteBox(result){
    // remove duplicates
    const uniqueResult = Array.from(new Set(result));
    // create list elements for the autocomplete box
    const content = uniqueResult.map((list) => {
        return "<li onclick=SelectInput(this)>" + list.toLowerCase() + "</li>";
    });
    // update the terms listed for the search bar's autocomplete selection
    AUTOCOMPLETE_RESULTS.innerHTML = "<ul>" + content.join('') + "</ul>";
    // Select all list items in the autocomplete menu
    const listItems = document.querySelectorAll('.autocomplete-box li');
    // Iterate over the list items
    listItems.forEach((li, index) => {
    // Add a mouseover event listener to each list item
        li.addEventListener('mouseover', function(event) {
            // clear active items
            let activeItems = document.querySelectorAll(".hovered");
            for (item of activeItems){
                item.classList.remove('hovered');
            }
            // add the hover effect
            this.classList.add('hovered');
            // update active item
            activeItemIndex = index;
        });
        // Add a mouseout event listener to each list item
        li.addEventListener('mouseout', function(event) {
            // remove the hover effect
            let activeItems = document.querySelectorAll(".hovered");
            for (item of activeItems){
                item.classList.remove('hovered');
            }
            // update active item
            activeItemIndex = -1;
        });
    });
 }

 
/** ShowResult
 * Updates the result box to display the matching keys for the given value
 * @param {Array} keys - all the matching keys for the given value
 */
function ShowResult(keys, value) {
    let results = keys.join(', ');
    // the provided term matches at least one category
    if (keys != ""){
        // show the answer in the result box
        if (behaviorToggle){
            RESULT_BOX.innerHTML = `"${value}" contained in: <br />${results}`
        }
        else{
            RESULT_BOX.innerHTML = `"${value}" found in: <br />${results}`
        }
    }
    else{
        // the provided term does not match any of our categories
        RESULT_BOX.innerHTML = `No matching result for "${value}"`;
    }
    // draw a box around the answer
    RESULT_BOX.classList = "bordered result-box"
 }


 /** UpdateAutocompleteHighlight
  * Changes which item on the autocomplete box is currently being highlighted
  * @param {Event} event - the javascript event being triggered
  * @param {Array} itemList - the current list of terms in the autocomplete box
  */
function UpdateAutocompleteHighlight(event, itemList){
    // if nothing is currently highlighted
    if (activeItemIndex === -1){
        // determine which key is being pressed
        switch(event.key){
            case 'ArrowUp':
                // arrow up button with no active item should do nothing
                event.preventDefault();
                break;
            case 'ArrowDown':
                // arrow down button with no active item show select the first item on the list
                event.preventDefault();
                activeItemIndex = 0;
                itemList[activeItemIndex].classList.add("hovered");
                // scroll to the active item
                UpdateAutocompleteScroll(event, itemList);
                break;
            case 'Enter':
                // enter button with no active item should run the search bar with no input
                SelectInput(INPUT_BOX.value);
            default:
                // any other button press with no active item should do nothing
                break;
        }
    }
    // if something is currently highlighted
    else if (activeItemIndex >= 0){
        // determine which key is being pressed
        switch(event.key){
            case 'ArrowUp':
                // arrow up button with an active item should move the highlight up one item
                event.preventDefault();
                // remove the highlight from the previous item
                itemList[activeItemIndex].classList.remove("hovered");
                // on any item except for the first one, we move up one
                if (activeItemIndex != 0){
                    activeItemIndex -= 1;
                }
                // if we're on the first item, we wrap to the bottom
                else{
                    activeItemIndex = itemList.length - 1;
                }
                // add the highlight to the current item
                itemList[activeItemIndex].classList.add("hovered");
                // scroll the viewport so it's visible
                UpdateAutocompleteScroll(event, itemList);
                break;
                case 'ArrowDown':
                // arrow down button with an active item should move the highlight down one item
                event.preventDefault();
                // remove the highlight from the previous item
                itemList[activeItemIndex].classList.remove("hovered");
                // on any item except for the last one, we move down one
                if (activeItemIndex != (itemList.length - 1)){
                    activeItemIndex += 1;
                }
                // if we're on the last item, we go back to the top
                else{
                    activeItemIndex = 0;
                }
                // add the highlight to the current item
                itemList[activeItemIndex].classList.add("hovered");
                // scroll the viewport so it's visible
                UpdateAutocompleteScroll(event, itemList);
                break;
                case 'Enter':
                // enter button with an active item should run the search bar with the currently active item
                SelectInput(itemList[activeItemIndex]);
            // any other button press with an active item should do nothing
            default:
                break;
        }   
    }
}


/** UpdateAutocompleteScroll
 * Scrolls the viewport to show the currently selected item
 * @param {Event} event - the javascript event being triggered
 * @param {Array} itemList - the current list of terms in the autocomplete box
 */
function UpdateAutocompleteScroll(event, itemList){
    // scroll the viewport so the current item is visible
    itemList[activeItemIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
    });
}


/** UpdateSearchBar
 * Changes the value in the search bar's input box
 */
function UpdateSearchBar(){
    // if the input field is empty
    if (!INPUT_BOX.value) {
        // get all values from the terms dictionary
        const values = Object.values(terms).flat();
        // populate the autocomplete box with all values from the terms dictionary
        PopulateAutocompleteBox(values);
       }
    // if the input field is not empty
    else{
        let result = [];
        let input = INPUT_BOX.value;
        if(input.length){
            let values;
            // switch behavior based on the toggle switch
            if (behaviorToggle === true){
                // get all values from the terms dictionary that contain the values currently in the input field
                values = Object.values(terms).flatMap(value => value).filter(value => value.toLowerCase().includes(input.toLowerCase()));
            }
            else{
                // get all values from the terms dictionary that start with the values currently in the input field
                values = Object.values(terms).flatMap(value => value).filter(value => value.toLowerCase().startsWith(input.toLowerCase()));
            }
            result = [...values];
        }
        // populate the autocomplete box with the resulting terms
        PopulateAutocompleteBox(result);
    }
}


/** HideOptions
 * Hides the autocomplete menu when the user clicks outside the search bar 
 * @param {Array} availableTerms - the list of terms currently displayed in the autocomplete box
 */
function HideOptions(availableTerms){
    availableTerms.innerHTML = '';
}


/** HighlightDiv
 * Highlights the categories and terms that match with the term being searched for
 * @param {string} result = the term being searched for
 */
function HighlightDiv(result) {
    // grab all the term categories
    const divs = document.querySelectorAll('.terms-list');
    // clear any curretly highlighted entries
    let highlightedDivs = document.querySelectorAll('.highlightedDiv');
    highlightedDivs.forEach(div => {
        div.classList.remove('highlightedDiv');
    });
    let highlightedTerms = document.querySelectorAll('.highlightedTerm');
    highlightedTerms.forEach(term => {
        term.classList.remove('highlightedTerm');
    });
    // highlight divs that contain the result
    divs.forEach(div => {
        // force a reflow to ensure the highlight animation plays
        void div.offsetHeight;
        /* This line is necessary because of the way CSS animations work (they only trigger 
        when they detect a change in state). This line accesses an arbitrary porperty (namely, 
        offsetHeight) that requires layout information, forcing the browser to recalculate the 
        layout of the element and enabling the animation to play even if the element is already
        in the target state. I am aware that this solution sucks. */

        // grab all the terms in the current category
        const liElements = Array.from(div.querySelector('ul').getElementsByTagName('li'));
        // for every term in the highlighted category
        liElements.forEach(li => {
            // if the search behavior is toggled (contains)
            if (behaviorToggle){
                // if it contains the desired term
                if (li.textContent.toLowerCase().includes(result.toLowerCase())){
                    // highlight the div
                    div.classList.add('highlightedDiv');
                    // highlight the term
                    li.classList.add('highlightedTerm');
                    // scroll the viewport
                    li.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                    });
                }
            }
            // if the search behavior is not toggled (matches)
            else{
                // if it matches the desired term
                if (li.textContent.toLowerCase() === result.toLowerCase()){
                    // highlight the div
                    div.classList.add('highlightedDiv');
                    // highlight the term
                    li.classList.add('highlightedTerm');
                    // scroll the viewport
                    li.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                    });
                }
            }
        });
    });
    // highlight the result box
    RESULT_BOX.classList.add('highlightedDiv');
  }


/** GetTerms
 *  Fetches the relevant terms from the remote repository
 * @param {string} path - URL to the desired JSON data in the remote repository
 * @returns the requested JSON data
 */
async function GetTerms(path) {
    // try to get the json data from the remote repo
    const response = await fetch(path);
    // if we didn't get the data
    if (!response.ok) {
        // log an error message to the console
        throw new Error(`HTTP error fetching JSON data - status: ${response.status}`);
    }
    // return the JSON data that the remote repo responded with
    return await response.json();
 }


 /** PopulateHTML
 * Updates the page to display the appropriate terms for the selected game
 * @param {json} terms - JSON data containing the relevant terms for the selected game
 */
 function PopulateHTML(terms) {
    // check every category in our JSON data
    for (let key in terms) {
        // make a container for the terms in each category new
        let div = document.createElement('div');
        div.className = 'terms ' + key.toLowerCase().replace(/\s+/g, '') + ' flex'; // remove whitespace from the key
        // make a container for the <ul> element that lists the terms
        let termsList = document.createElement('div');
        termsList.className = 'terms-list bordered'
        // make the title for this category
        let h2 = document.createElement('h2');
        h2.textContent = key;
        // make the list of terms
        let ul = document.createElement('ul');
        ul.className = 'terms-text';
        // for each term in the current category
        for (let value of terms[key]) {
            // make a <li> element for the current term
            let li = document.createElement('li');
            li.textContent = value;
            // add it to our list of terms
            ul.appendChild(li);
        }
        // add the category title to the container
        div.appendChild(h2);
        // add the term list to the container
        termsList.appendChild(ul);
        div.appendChild(termsList);
        // add the completed category to the container with all the categories
        TERMS_CONTAINER.appendChild(div);
    }
 }


 /** SwapGame
  * Changes which game we want to search for terms in
  * @param {string} game - the selected game we want to search for terms in
  */
function SwapGame(game){
    // clear current terms
    TERMS_CONTAINER.innerHTML = '';
    // clear the search bar
    INPUT_BOX.value = "";
    HideOptions(AUTOCOMPLETE_RESULTS);
    // clear result box
    RESULT_BOX.innerHTML = "";
    RESULT_BOX.classList = "";
    // change background image
    ChangeBackground(game);
    // get path to appropriate JSON data on the remote repo for the selected game
    let termsURL = `https://raw.githubusercontent.com/MediumBob/PraiseTheMessage/main/assets/json/${game}-terms.json`
    // fetch terms from remote repo
    GetTerms(termsURL)
    .then(data => {
        // load data from JSON into a javascript variable
        terms = data;
        // add lists of the terms under the search bar
        PopulateHTML(terms);
    })
    .catch(error => {
        // this should probably be a more helpful error message
        console.error('ERROR: ', error);
    });
}


/** BehaviorToggle
 * Switches the search bar's autocomplete behavior
 * @param {boolean} behavior - is the user searching for terms that start with input (behaviorToggle = false) or contain input (behaviorToggle = true)?
 */
function BehaviorToggle(behavior){
    if (behavior === "contains"){
        behaviorToggle = true;
    }
    else{
        behaviorToggle = false;
    }
}


/** ChangeBackground
 * Changes the background image based on the selected game
 * @param {string} game - the selected game we want to search for terms in
 */
function ChangeBackground(game){
    // if image index gets out of bounds or doesn't exist for some reason, just default to Elden Ring background rather than break everything
    if (imageIndex >= images.length || !(images[imageIndex])){
        imageIndex = 0;
    }
    // stop showing the current background image
    images[imageIndex].classList.remove("showing");
    // determine which background image to show
    switch (game){
        case 'eldenring':
            imageIndex = 0;
            break;
        case 'darksouls1':
            imageIndex = 1;
            break;
        case 'darksouls2':
            imageIndex = 2;
            break;
        case 'darksouls3':
            imageIndex = 3;
            break;
        case 'bloodborne':
            imageIndex = 4;
            break;
    }
    // start showing the appropriate background image
    images[imageIndex].classList.add("showing");
}