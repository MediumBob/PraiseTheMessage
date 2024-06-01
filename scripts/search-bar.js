/* ****************** */
// Variables
/* ****************** */
const INPUT_BOX = document.getElementById("input-box");                         // the serach bar's input box
const AUTOCOMPLETE_RESULTS = document.querySelector(".autocomplete-box");       // the search bar's autocomplete box (that lists the avaialbe terms)
const SEARCH_ICON = document.querySelector(".fa-solid.fa-magnifying-glass");    // the search bar's "serach" icon (the magnifying glass)let behaviorToggle = true;                                                      // is the search bar behavior toggled?
const GAME_DROPDOWN = document.getElementById("game-dropdown");                 // the dropdown menu to select a game
const BEHAVIOR_DROPDOWN = document.getElementById("search-behavior-dropdown");  // the dropdown menu to select the search behavior
let RESULT_BOX = document.querySelector(".result-box")                          // the container for the result
let behaviorToggle = false;                                                     // is the search bar behavior toggled?
let activeItemIndex = -1;                                                       // which item is highlighted in the autocomplete menu?

/* ****************** */
// Executed code
/* ****************** */

/* ****************** */
// Event listeners
/* ****************** */
// SEARCH ICON WAS CLICKED
SEARCH_ICON.addEventListener('click', function() {
    SelectInput(INPUT_BOX.value);
});

// SCREEN WAS CLICKED (somewhere)
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

// SEARCH BAR FOCUSED
INPUT_BOX.addEventListener("focus", UpdateSearchBar);

// INPUT ADDED TO SEARCH BAR
INPUT_BOX.addEventListener("input", UpdateSearchBar);
   
// KEY-DOWN EVENT
INPUT_BOX.onkeydown = function(event){
    let listItems = document.querySelectorAll('.autocomplete-box ul li');
    UpdateAutocompleteHighlight(event, listItems);
}

/* ****************** */
// Function definitions
/* ****************** */

/** SelectInput()
 * Executes when the user runs the search bar by either clicking an autocomplete 
 * selection, clicking the search icon, or pressing the enter key.
 * @param {*} userSelection 
 */
function SelectInput(userSelection){
    let searchTerm;
    console.log("top of SelectInput: ",userSelection)
    // grab the term we are searching for
    if (userSelection instanceof Element){
        searchTerm = userSelection.innerHTML;
    }
    else{
        searchTerm = userSelection;
    }
    console.log("searchTerm: " +searchTerm)
    // check which keys map to the provided value (ex: knight is listed under "enemies" and also "people"; we want to list both)
    let keys = Search(searchTerm);
    // show the answer(s) in the result box
    ShowResult(keys, searchTerm);
    // update the term listed in the search box
    INPUT_BOX.value = searchTerm;
    // hide the autocomplete box
    HideOptions(AUTOCOMPLETE_RESULTS);
    // highlight the appropriate category of terms
    highlightDiv(searchTerm);
    // clear the active item
    activeItemIndex = -1;
 }

 
 /** Search()
  * 
  * @param {*} searchTerm 
  * @returns 
  */
 function Search(searchTerm) {
    let keys = [];
    let found;
    for (let [key, value] of Object.entries(terms)) { //NOTE: the terms variable holds our json data
        // behavior toggled (contains)
        if (behaviorToggle){
            // check what keys contain the given value
            found = value.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // behavior not toggled (matches)
        else{
        // check what keys match the given value
            found = value.some(item => item.toLowerCase() === searchTerm.toLowerCase());
        }
        if (found) {
            keys.push(key);
        }
    }
    // if there are any matching keys, return them
    //return keys.length ? keys : null;
    return keys

 }

 
 /** PopulateAutocompleteBox()
  * 
  * @param {*} result 
  */
 function PopulateAutocompleteBox(result){
    // remove duplicates
    const uniqueResult = Array.from(new Set(result));
    // 
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
            console.log('Mouse over:', this.textContent); // debug output
            // clear active items
            let activeItems = document.querySelectorAll(".hovered");
            for (item of activeItems){
                item.classList.remove('hovered');
            }
            // add the hover effect
            this.classList.add('hovered');
            // update active item
            activeItemIndex = index;
            console.log("activeItemIndex: ",activeItemIndex)
        });
        // Add a mouseout event listener to each list item
        li.addEventListener('mouseout', function(event) {
            console.log("mouse out:", this.textContent) // debug output
            // remove the hover effect
            let activeItems = document.querySelectorAll(".hovered");
            for (item of activeItems){
                item.classList.remove('hovered');
            }
            //this.classList.remove('hovered');
            // update active item
            activeItemIndex = -1;
            console.log("activeItemIndex: ",activeItemIndex)

        });
    });
 }

 
/** ShowResult()
 * 
 * @param {*} keys 
 */
function ShowResult(keys, value) {
    let results = keys.join(', ');
    // does the term exist in any of our categories? (does the value match any keys from terms.json?)
    if (keys != ""){
        console.log(`The corresponding keys for \"${value}\" are: \"${keys}\"`);    // debug output
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
        console.log(`No corresponding keys found for: ${value}`);                   // debug output
        RESULT_BOX.innerHTML = `No matching result for "${value}"`;
    }
    // draw a box around the answer
    RESULT_BOX.classList = "bordered result-box"
 }


 
function UpdateAutocompleteHighlight(event, itemList){
    // if nothing is currently highlighted
    console.log(`top of updateAutocompleteHighlight activeItemIndex: ${activeItemIndex}`);
    if (activeItemIndex === -1){
        switch(event.key){
            case 'ArrowUp':
                event.preventDefault();
                // arrow up with no active item should do nothing
                console.log("up arrow - no active item");
                break;
            case 'ArrowDown':
                event.preventDefault();
                console.log("down arrow - no active item");
                activeItemIndex = 0;
                console.log("setting activeItemIndex to ",activeItemIndex)
                itemList[activeItemIndex].classList.add("hovered");
                // scroll to the active item
                UpdateAutocompleteScroll(event, itemList);
                break;
            case 'Enter':
                console.log("enter pressed, no active item")
                console.log("inputbox: ",INPUT_BOX.innerHTML)
                SelectInput(INPUT_BOX.value);
            default:
                console.log("default case; activeItemIndex: ",activeItemIndex);
                break;
        }
    }
    // if something is currently highlighted
    else if (activeItemIndex >= 0){
        switch(event.key){
            case 'ArrowUp':
                event.preventDefault();
                itemList[activeItemIndex].classList.remove("hovered");
                // normal scroll up
                if (activeItemIndex != 0){
                    activeItemIndex -= 1;
                    console.log(`decremented activeItemIndex to ${activeItemIndex}`)
                }
                // if we're on the first item, we wrap to the bottom
                else{
                    activeItemIndex = itemList.length - 1;
                    console.log(`changed activeItemIndex to ${activeItemIndex}`)
                }
                itemList[activeItemIndex].classList.add("hovered");
                UpdateAutocompleteScroll(event, itemList);
                break;
            case 'ArrowDown':
                event.preventDefault();
                itemList[activeItemIndex].classList.remove("hovered");
                // normal scroll down
                if (activeItemIndex != (itemList.length - 1)){
                    activeItemIndex += 1;
                    console.log(`incremented activeItemIndex to ${activeItemIndex}`)
                }
                // if we're on the last item, we go back to the top
                else{
                    activeItemIndex = 0;
                    console.log(`changed activeItemIndex to ${activeItemIndex}`)
                }
                itemList[activeItemIndex].classList.add("hovered");
                UpdateAutocompleteScroll(event, itemList);
                break;
            case 'Enter':
                console.log("enter pressed");
                SelectInput(itemList[activeItemIndex]);
            default:
                console.log("default case; activeItemIndex: ",activeItemIndex);
                break;
        }   
    }
}

function UpdateAutocompleteScroll(event, itemList){
    itemList[activeItemIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
    });
}


function UpdateSearchBar(){
    console.log("Updating Serach Bar")
    // If the input field is empty
    if (!INPUT_BOX.value) {
        // Get all values from the terms dictionary
        const values = Object.values(terms).flat();
        // Populate the autocomplete box with all values from the terms dictionary
        PopulateAutocompleteBox(values);
       }
    // If the input field is not empty
    else{
        let result = [];
        let input = INPUT_BOX.value;
        if(input.length){
            let values;
            // switch behavior based on the toggle switch
            if (behaviorToggle === true){
                // Get all values from the terms dictionary that include the values currently in the input field
                values = Object.values(terms).flatMap(value => value).filter(value => value.toLowerCase().includes(input.toLowerCase()));
            }
            else{
                // Get all values from the terms dictionary that start with the values currently in the input field
                values = Object.values(terms).flatMap(value => value).filter(value => value.toLowerCase().startsWith(input.toLowerCase()));

            }
            result = [...values];
            console.log(result); // Debug output
        }
        // Populate the autocomplete box
        PopulateAutocompleteBox(result);
    }
}


// call this when the user clicks outside the search bar
/**
 * 
 * @param {*} availableTerms 
 */
function HideOptions(availableTerms){
    availableTerms.innerHTML = '';
}

/**
 * 
 * @param {*} result 
 * @returns 
 */
function highlightDiv(result) {
    // grab all the term categories
    const divs = document.querySelectorAll('.terms-list');

    // clear any curretly highlighted entries
    let highlightedDivs = document.querySelectorAll('.highlightedDiv');
    let highlightedTerms = document.querySelectorAll('.highlightedTerm');

    highlightedDivs.forEach(div => {
        div.classList.remove('highlightedDiv');
    });
    highlightedTerms.forEach(term => {
        term.classList.remove('highlightedTerm');
    });

    // Highlight divs that contain the result
    divs.forEach(div => {
        // Force a reflow to ensure the highlight animation plays. This is necessary because of the way CSS animations work (they only trigger when they detect a change in state). This line accesses an arbitrary porperty (namely, offsetHeight) that requires layout information, forcing the browser to recalculate the layout of the element and enabling the animation to play even if the element is already in the target state. I am aware that this solution sucks.
        void div.offsetHeight;

        // grab all the terms in the current category
        const liElements = Array.from(div.querySelector('ul').getElementsByTagName('li'));

        // for every term in the highlighted category
        liElements.forEach(li => {
            //if behavior is toggled (contains)
            if (behaviorToggle){
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
            // if behavior is not toggled (matches)
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
    //Highlight the result box
    const RESULT_BOX = document.querySelector(".result-box");
    // void RESULT_BOX.offsetHeight;
    RESULT_BOX.classList.add('highlightedDiv');
  }











// Split this js into multiple files, this is entirely too long






/* ****************** */
// Variables
/* ****************** */
const DROPDOWN = document.getElementById('game-dropdown');
let selectedGame = DROPDOWN.value;
const TERMSCONTAINER = document.querySelector(".terms-container");
let terms = {}
let images = document.querySelectorAll(".background");

let imageIndex = 0;

/* ****************** */
// Executed code
/* ****************** */

SwapGame(selectedGame);

/* ****************** */
// Function definitions
/* ****************** */

/** GetTerms
 *  Fetches the relevant terms from the remote repository
 * @param {string} path - URL to the desired JSON data in the remote repository
 * @returns the requested JSON data
 */
async function GetTerms(path) {
    const response = await fetch(path);
    if (!response.ok) {
        if(response.status === 404){
            console.log(response.json)
        }
        throw new Error(`HTTP error fetching JSON data - status: ${response.status}`);
    }
    return await response.json();
 }

 /**
 * Updates the page to display the appropriate terms for the selected game
 * @param {json} terms - JSON data containing the relevant terms for the selected game
 */
 function PopulateHTML(terms) {
    // Get the container where the divs will be added
    const container = document.querySelector('.terms-container');
 
    // Iterate over the keys and values in the terms object
    for (let key in terms) {
        // Create a new div element with the class 'terms' and the key as its class name
        let div = document.createElement('div');
        div.className = 'terms ' + key.toLowerCase().replace(/\s+/g, '') + ' flex'; // remove whitespace from the key

        // Create a new div element with the class 'terms-list' to contain the ul
        let termsList = document.createElement('div');
        termsList.className = 'terms-list bordered'

        // Create an h2 element with the key as its text content
        let h2 = document.createElement('h2');
        // h2.className = 'terms-text';
        h2.textContent = key;
 
        // Create a ul element
        let ul = document.createElement('ul');
        ul.className = 'terms-text';
 
        // Iterate over the values
        for (let value of terms[key]) {
            // Create a li element with the value as its text content
            let li = document.createElement('li');
            li.textContent = value;
 
            // Append the li element to the ul element
            ul.appendChild(li);
        }
 
        // Append the h2 and ul elements to the div element
        div.appendChild(h2);
        termsList.appendChild(ul);
        div.appendChild(termsList);
 
        // Append the div element to the container
        container.appendChild(div);
    }
 }

 /**
  * 
  * @param {*} game 
  */
function SwapGame(game){
    // clear current terms
    document.querySelector('.terms-container').innerHTML = '';

    // clear the search bar maybe?
    INPUT_BOX.value = "";
    HideOptions(AUTOCOMPLETE_RESULTS);

    // clear result box
    RESULT_BOX.innerHTML = "";
    RESULT_BOX.classList = "";

    // change background image
    ChangeBackground(game);

    // get the correct path to JSON data on the remote repo for the selected game
    let termsURL = `https://raw.githubusercontent.com/MediumBob/PraiseTheMessage/main/assets/json/${game}-terms.json`
    // let termsURL = `https://raw.githubusercontent.com/MediumBob/PraiseTheMessage/main/assets/json/terms.json`

    // fetch terms from remote repo
    GetTerms(termsURL)
    .then(data => {
        // load data from JSON into a javascript variable
        terms = data;
        // add lists of the terms under the search bar
        PopulateHTML(terms);
    })
    .catch(error => {
        console.error('ERROR: ', error);
    });
}

/**
 * Switches the search bar's autocomplete behavior
 * @param {boolean} behavior - is the user searching for terms that start with input (behaviorToggle = false) or contain input (behaviorToggle = true)?
 */
function BehaviorToggle(behavior){
    //alert(behavior)
    if (behavior === "contains"){
        behaviorToggle = true;
    }
    else{
        behaviorToggle = false;
    }
}

function ChangeBackground(game){
    if (imageIndex >= images.length || !(images[imageIndex])){
        imageIndex = 0;
    }
    images[imageIndex].classList.remove("showing");
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

    images[imageIndex].classList.add("showing");
}