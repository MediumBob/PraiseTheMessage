// init some variable for later
const INPUT_BOX = document.getElementById("input-box");                         // the serach bar's input box
const AUTOCOMPLETE_RESULTS = document.querySelector(".result-box");             // the search bar's autocomplete box (that lists the avaialbe terms)
const SEARCH_ICON = document.querySelector(".fa-solid.fa-magnifying-glass");    // the search bar's "serach" icon (the magnifying glass)
const TOGGLE_BEHAVIOR = document.querySelector("#toggle");                      // the search bar's "toggle" behavior slider
let behaviorToggle = true;                                                      // is the search bar behavior toggled?
let activeItem = null;                                                          // is an item highlighted in the autocomplete menu?

// run some functions immediately:
HighlightToggleText(behaviorToggle);                                            // ensure proper serach mode is highlighted


/** SelectInput()
 * 
 * @param {*} list 
 */
function SelectInput(list){
    // grab the term we are searching for
    let searchTerm = list.innerHTML;
    // check which keys map to the provided value (ex: knight is listed under "enemies" and also "people"; we want to list both)
    let keys = Search(searchTerm);
    // show the answer(s) in the result box
    ShowResult(keys, searchTerm);
    // update the term listed in the search box
    INPUT_BOX.value = searchTerm;
    // hide the autocomplete box
    HideOptions(AUTOCOMPLETE_RESULTS);
    highlightDiv(searchTerm);
 }


 /** Search()
  * 
  * @param {*} searchTerm 
  * @returns 
  */
 function Search(searchTerm) {
    let keys = [];
    // check what keys match the given value
    for (let [key, value] of Object.entries(terms)) {
        let found = value.some(item => item.toLowerCase() === searchTerm.toLowerCase());
        if (found) {
            keys.push(key);
        }
    }
    // if there are any matching keys, return them
    return keys.length ? keys : null;
 }


 /** Display()
  * 
  * @param {*} result 
  */
 function Display(result){
    // remove duplicates
    const uniqueResult = Array.from(new Set(result));
    // 
    const content = uniqueResult.map((list) => {
        return "<li onclick=SelectInput(this)>" + list.toLowerCase() + "</li>";
    });
    // update the terms listed for the search bar's autocomplete selection
    AUTOCOMPLETE_RESULTS.innerHTML = "<ul>" + content.join('') + "</ul>";
 }



// ENTER BUTTON WAS PRESSED
INPUT_BOX.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const firstResult = document.querySelector(".result-box li:first-child");
        const categoryName = firstResult.parentElement.parentElement.className.split(' ')[1];
        console.log("FR: " + firstResult.textContent)
        console.log("CN: " + categoryName)
        if (firstResult) {
            SelectInput(firstResult);
            highlightDiv(firstResult.textContent);
            //AUTOCOMPLETE_RESULTS.innerHTML = '';
            HideOptions(AUTOCOMPLETE_RESULTS);
        }
    }
});



// SEARCH ICON WAS CLICKED
SEARCH_ICON.addEventListener('click', function() {
    // FIXME This shouldnt autoselet the first result, it should use whatever is in the input box
    const firstResult = document.querySelector(".result-box li:first-child");
    if (firstResult) {
        SelectInput(firstResult);
        highlightDiv(firstResult.textContent);
        if(!result.length){
            //AUTOCOMPLETE_RESULTS.innerHTML = '';
            HideOptions(AUTOCOMPLETE_RESULTS);
        }
    }
});

// SCREEN WAS CLICKED (somewhere)
document.addEventListener('click', (event) =>{
    // Did the click fail to do either of the following: focus the input box or click the search icon?
    if (!(event.target === INPUT_BOX) && !(event.target === SEARCH_ICON) && !(event.target === TOGGLE_BEHAVIOR)) {
        // Remove the autocomplete results
        HideOptions(AUTOCOMPLETE_RESULTS);
    }
});


/** ShowResult()
 * 
 * @param {*} keys 
 */
function ShowResult(keys, value) {
    // does the term exist in any of our categories? (does the value match any keys from terms.json?)
    if (keys){
        console.log(`The corresponding keys for \"${value}\" are: \"${keys}\"`);    // debug output
        // grab the result box (where the answer goes)
        const resultBox = document.querySelector(".res-box");
        // show the answer in the result box
        resultBox.innerHTML = keys.join(', ');
        // draw a box around the answer
        resultBox.style.border = "3px solid";
        //resultBox.style.borderColor = "rgb(208, 171, 109)";
        resultBox.style.borderColor = "rgb(255, 0, 0)";
        resultBox.style.borderRadius = "15px";
    }
    else{
        // the provided term does not match any of our categories
        console.log(`No corresponding keys found for: ${value}`);                   // debug output
    }
 }


// KEY-DOWN EVENT
/**
 * 
 */
INPUT_BOX.onkeydown = function(event){
    let result = [];
    let input = INPUT_BOX.value;
    let listItems = document.querySelectorAll('.result-box ul li');
    let listItemValues = Array.from(listItems).map(li => li.textContent);
    console.log("listItems: " + listItemValues);
    console.log("listItems[0]: " + listItems[0]);
    console.log("typeof(listItems[0]): " + typeof(listItems[0]));
    
    let nextItem;

    switch(event.key){
        case 'Enter':
            console.log("enter")
            break;
        case 'ArrowUp':
            console.log("up")
            setActiveItem(nextItem, activeItem);
            if (activeItem){
                activeItem.nextElementSibling;

            }
            else{
                activeItem = listItems[0];
            }
            break;
        case 'ArrowDown':
            console.log("down")
            setActiveItem(nextItem, activeItem);
            if (activeItem){
                activeItem = activeItem.nextElementSibling;

            }
            else{
                activeItem = listItems[0];
            }
            console.log("activeItem.nextElementSibling: "+ activeItem.nextElementSibling)
            break;
        default:

            break;

    }

    //FIXME these should be defined outside of this event listener, but when I move them my code breaks? wot?
    // Function to set the 'hovered' class on an item
    function setActiveItem(item, activeItem) {
        console.log("inside setActiveItem");
        if (activeItem) {
            console.log("removing hovered");
            activeItem.classList.remove('hovered');
        }
        if (item) {
            console.log("adding hovered");
            item.classList.add('hovered');
        }
        activeItem = item;
        console.log("activeItem: " + activeItem.textContent);
    }
    // Event listener for mouseover events to handle mouse interactions
    document.querySelector('.result-box ul').addEventListener('mouseover', function(event) {
        if (event.target.tagName === 'li') {
            setActiveItem(event.target);
        }
    });

}


// SEARCH BAR FOCUSED
INPUT_BOX.addEventListener("focus", UpdateSearchBar);

// INPUT ADDED TO SEARCH BAR
INPUT_BOX.addEventListener("input", UpdateSearchBar);
   
// TOGGLE SEARCH BEHAVIOR
TOGGLE_BEHAVIOR.addEventListener("change", function(event) {
    event.stopPropagation();
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

function UpdateSearchBar(){
    // If the input field is empty
    if (!INPUT_BOX.value) {
        // Get all values from the terms dictionary
        const values = Object.values(terms).flat();
        // Populate the autocomplete box with all values from the terms dictionary
        Display(values);
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
        Display(result);
    }
}


// call this when the user clicks outside the search bar
function HideOptions(availableTerms){
    availableTerms.innerHTML = '';
}


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
        // Force a reflow to ensure the highlight animation plays. This is necessary because of the way CSS animations work (they only trigger when they detect a change in state). This line accesses an arbitrary porperty (namely, offsetHeight) that requires layout information, forcing the browser to recalculate the layout of the element and enabling the animation to play even if the element is already in the target state.
        void div.offsetHeight;
        // if the category contains the desired term
        if (div.textContent.toLowerCase().includes(result.toLowerCase())) {
            // trigger the highlight animation over the entire category
            div.classList.add('highlightedDiv');
        }
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