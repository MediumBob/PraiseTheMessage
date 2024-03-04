// init some global variable for later
const INPUT_BOX = document.getElementById("input-box");                         // the serach bar's input box
const AUTOCOMPLETE_RESULTS = document.querySelector(".result-box");             // the search bar's autocomplete box (that lists the avaialbe terms)
const SEARCH_ICON = document.querySelector(".fa-solid.fa-magnifying-glass");    // the search bar's "serach" icon (the magnifying glass)
const TOGGLE_BEHAVIOR = document.querySelector("#toggle");                      // the search bar's "toggle" behavior slider
let behaviorToggle = true;                                                      // is the search bar behavior toggled?
let activeItemIndex = -1;                                                        // which item is highlighted in the autocomplete menu?

// run some functions immediately:
HighlightToggleText(behaviorToggle);                                            // ensure proper serach mode is highlighted

/***** define event listeners *****/

// 1. SEARCH ICON WAS CLICKED
SEARCH_ICON.addEventListener('click', function() {
    SelectInput(INPUT_BOX.value);
});

// 2. SCREEN WAS CLICKED (somewhere)
document.addEventListener('click', (event) =>{
    // did the click fail to do any of the following:
    //      1. focus the input box            2. click the search icon          3. toggle the search behavior
    if (!(event.target === INPUT_BOX) && !(event.target === SEARCH_ICON) && !(event.target === TOGGLE_BEHAVIOR)) {
        // if the click was anywhere else other than what was mentioned above, we remove the autocomplete results
        HideOptions(AUTOCOMPLETE_RESULTS);
    }
});

// 3. SEARCH BAR FOCUSED
INPUT_BOX.addEventListener("focus", UpdateSearchBar);

// 4. INPUT ADDED TO SEARCH BAR
INPUT_BOX.addEventListener("input", UpdateSearchBar);
   
// 5. TOGGLE SEARCH BEHAVIOR
TOGGLE_BEHAVIOR.addEventListener("change", function(event) {
    // reset the active item
    activeItemIndex = -1;
    //event.stopPropagation();
    if (this.checked){
        behaviorToggle = true;
    }
    else {
        behaviorToggle = false;
    }
    HighlightToggleText(behaviorToggle);
    if (INPUT_BOX.value){
        UpdateSearchBar();
    }
});

// 6. KEY-DOWN EVENT
/**
 * 
 */
INPUT_BOX.onkeydown = function(event){
    let listItems = document.querySelectorAll('.result-box ul li');
    UpdateAutocompleteHighlight(event, listItems);
}

/***** define helper functions *****/

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
    // check which keys map to the provided value (ex: knight is listed under "enemies" and also "people"; we want to list both)
    let keys = Search(searchTerm);
    // show the answer(s) in the result box
    ShowResult(keys, searchTerm);
    // update the term listed in the search box
    INPUT_BOX.value = searchTerm;
    // hide the autocomplete box
    HideOptions(AUTOCOMPLETE_RESULTS);
    // highlight the appropriate div
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
    // check what keys match the given value
    for (let [key, value] of Object.entries(terms)) { //NOTE: the terms variable holds our json data, and is defined in get-terms.js
        let found = value.some(item => item.toLowerCase() === searchTerm.toLowerCase());
        if (found) {
            keys.push(key);
        }
    }
    // if there are any matching keys, return them
    return keys.length ? keys : null;
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
    const listItems = document.querySelectorAll('.result-box li');
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
    // grab the result box (where the answer goes)
    const resultBox = document.querySelector(".res-box");
    // does the term exist in any of our categories? (does the value match any keys from terms.json?)
    if (keys){
        console.log(`The corresponding keys for \"${value}\" are: \"${keys}\"`);    // debug output
        // show the answer in the result box
        resultBox.innerHTML = keys.join(', ');
    }
    else{
        // the provided term does not match any of our categories
        console.log(`No corresponding keys found for: ${value}`);                   // debug output
        resultBox.innerHTML = `No matching result for "${value}"`;
    }
    // draw a box around the answer
    resultBox.style.border = "3px solid";
    resultBox.style.borderColor = "rgb(255, 0, 0)";
    resultBox.style.borderRadius = "15px";
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
            // if we're on the first item, we don't update anything
            case 'ArrowUp':
                event.preventDefault();
                if (activeItemIndex != 0){
                    itemList[activeItemIndex].classList.remove("hovered");
                    activeItemIndex -= 1;
                    console.log(`decremented activeItemIndex to ${activeItemIndex}`)
                    itemList[activeItemIndex].classList.add("hovered");
                    UpdateAutocompleteScroll(event, itemList);
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                // if we're on the last item, we don't update anything
                if (activeItemIndex != (itemList.length - 1)){
                    itemList[activeItemIndex].classList.remove("hovered");
                    activeItemIndex += 1;
                    console.log(`incremented activeItemIndex to ${activeItemIndex}`)
                    itemList[activeItemIndex].classList.add("hovered");
                    UpdateAutocompleteScroll(event, itemList);
                }
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
        //inline: 'start'
    });
    // const scrollAmount = 50;
    // if (event.key === 'ArrowUp'){
    //     AUTOCOMPLETE_RESULTS.scrollTop -= scrollAmount;
    // }
    // else if (event.key === 'ArrowDown'){
    //    AUTOCOMPLETE_RESULTS.scrollTop += scrollAmount;
    // }
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
    // Check if the result is a valid string
    if (typeof result !== 'string') {
        console.log('Invalid result:', result);
        return;
    }
  
    // Use a valid CSS selector
    const divs = document.querySelectorAll('.terms');
  
    // Check if any divs were selected
    if (!divs.length) {
        console.log('No divs selected');
        return;
    }

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
        // if the category contains the desired term
        const terms = div.textContent.toLowerCase().split('\n').filter(term => term.trim() !== '');
        const matchingTerm = terms.find(term => term === result.toLowerCase());
        if (matchingTerm) {
            // If the category contains the exact term, trigger the highlight animation over the entire category
            div.classList.add('highlightedDiv');
        }
        //OLD IMPLEMENTATION
        // if (div.textContent.toLowerCase().includes(result.toLowerCase())) {
        //     // trigger the highlight animation over the entire category
        //     div.classList.add('highlightedDiv');
        // }

        // double check that the category div has a <ul> child element
        const ulElement = div.querySelector('ul');
        if(ulElement){
            // for every term in the highlighted category
            const liElements = Array.from(ulElement.getElementsByTagName('li'));
            liElements.forEach(li => {
                // if it matches the desired term
                if (li.textContent.toLowerCase() === result.toLowerCase()){
                    // highlight the term
                    li.classList.add('highlightedTerm')
                }
            });
        }
    });
    //Highlight the result box
    const RESULT_BOX = document.querySelector(".res-box");
    void RESULT_BOX.offsetHeight;
    RESULT_BOX.classList.add('highlightedDiv');
  }

  
/**
 * 
 * @param {*} behaviorToggle 
 */
  function HighlightToggleText(behaviorToggle){
    const ON = document.querySelector(".contains");
    const OFF = document.querySelector(".start-with");
    if (behaviorToggle){
        ON.classList.add('highlighted-toggle-text');
        OFF.classList.remove('highlighted-toggle-text');
    }
    else {
        OFF.classList.add('highlighted-toggle-text');
        ON.classList.remove('highlighted-toggle-text');
    }

  }