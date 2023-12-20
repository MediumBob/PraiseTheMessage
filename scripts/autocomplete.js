
let terms = {}; // This will hold your JSON data

// Fetch the JSON data from the terms.json file
fetch('../assets/json/terms.json')
   .then(response => response.json())
   .then(data => {
       terms = data;
   });

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");


// user presses the search icon
const searchIcon = document.querySelector(".fa-solid.fa-magnifying-glass");
searchIcon.addEventListener('click', function() {
    const firstResult = document.querySelector(".result-box li:first-child");
    if (firstResult) {
        selectInput(firstResult);
        highlightDiv(firstResult.textContent);
        if(!result.length){
            resultsBox.innerHTML = '';
        }
    }
});

// user presses enter
inputBox.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const firstResult = document.querySelector(".result-box li:first-child");
        const categoryName = firstResult.parentElement.parentElement.className.split(' ')[1];
        console.log("FR: " + firstResult.textContent)
        console.log("CN: " + categoryName)
        if (firstResult) {
            selectInput(firstResult);
            highlightDiv(firstResult.textContent);
            resultsBox.innerHTML = '';
        }
    }
});

/**
 * 
 */
inputBox.onkeyup = function(){
    if(event.keyCode === 13){
        // enter key pressed - we have a separate function for enter
        return;
    }
    let result = [];
    let input = inputBox.value;
    if(input.length){
        // result = terms.filter( (keyword) => {
        //     return keyword.toLowerCase().startsWith(input.toLowerCase());
        // });
        // Get values that start with the input string
        let values = Object.values(terms).flatMap(value => value).filter(value => value.toLowerCase().startsWith(input.toLowerCase()));
        result = [...values];
        console.log(result);
    }
    display(result);
    if(!result.length){
        resultsBox.innerHTML = '';
    }
}

/**
 * 
 * @param {*} result 
 */
function display(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list.toLowerCase() + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

/**
 * 
 * @param {*} list 
 */
function selectInput(list){
    let searchTerm = list.innerHTML;
    let key = search(searchTerm);
    if (key) {
        showResult(key);
        console.log(`The corresponding key is: ${key}`);
    } else {
        console.log(`No corresponding key found for: ${searchTerm}`);
    }
    inputBox.value = searchTerm;
    resultsBox.innerHTML = '';
}

function search(searchTerm) {
    for (let [key, value] of Object.entries(terms)) {
        let found = value.find(item => item.toLowerCase() === searchTerm.toLowerCase());
        if (found) {
            return key;
        }
    }
    return null;
 }

 function showResult(key) {
    const resultBox = document.querySelector(".res-box");
    resultBox.innerHTML = key;
    // FIXME the following solution for positioning the response is probably not
    // very responsive and most likely breaks on other devices. Find another way!
    // In short, try research.
    switch(resultBox.innerHTML.toLowerCase()){
        case 'enemies':
            resultBox.style.left = '1%';
            break;
        case 'people':
            resultBox.style.left = '10%';
            break;
        case 'things':
            resultBox.style.left = '19%';
            break;
        case 'battle tactics':
            resultBox.style.left = '25%';
            break;
        case 'actions':
            resultBox.style.left = '36%';
            break;
        case 'situations':
            resultBox.style.left = '42%';
            break;
        case 'places':
            resultBox.style.left = '52%';
            break;
        case 'directions':
            resultBox.style.left = '58%';
            break;
        case 'body parts':
            resultBox.style.left = '66%';
            break;
        case 'concepts':
            resultBox.style.left = '73%';
            break;
        case 'phrases':
            resultBox.style.left = '83%';
            break;
        case 'conjunctions':
            resultBox.style.left = '88%';
            break;
        default:
            break;
    }
  }


function highlightDiv(result) {
    const div = document.querySelector(`.terms ${result}`);
    if (div) {
        div.classList.add('highlight');
    }
  }
  // FIXME freaking lord is listed twice - once in enemies and once in people. when you click either entry in the search bar, it always shows enemies. one should show people
  // skill is both an action and a thing
