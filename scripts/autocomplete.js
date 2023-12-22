
// define sone variables for later
let terms = {}; // this will hold the JSON data
const termsURL = 'https://raw.githubusercontent.com/MediumBob/PraiseTheMessage/main/assets/json/terms.json'; // URL for json data

/**
 * 
 * @param {*} path 
 * @returns 
 */
async function getTerms(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`HTTP error - status: ${response.status}`);
    }
    return await response.json();
 }

 // fetch terms.json from the remote repository
 getTerms(termsURL)
   .then(data => {
        // load the terms.json data into a javascript variable
        terms = data;
        // add lists of the terms under the search bar
        populateHTML(terms);
   })
   .catch(error => {
        console.error('Error:', error);
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
inputBox.onkeyup = function(event){
    if(event.key === 'Enter'){
        // enter key pressed, so break out - we have a separate function for the enter key
        return;
    }
    let result = [];
    let input = inputBox.value;
    if(input.length){
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
        case 'affinities':
            resultBox.style.left = '70%';
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

  function populateHTML(terms) {
    // Get the container where the divs will be added
    const container = document.querySelector('.grid');
 
    // Iterate over the keys and values in the terms object
    for (let key in terms) {
        // Create a new div element with the class 'terms' and the key as its class name
        let div = document.createElement('div');
        div.className = 'terms ' + key.toLowerCase();
 
        // Create an h2 element with the key as its text content
        let h2 = document.createElement('h2');
        h2.textContent = key;
 
        // Create an ul element
        let ul = document.createElement('ul');
 
        // Iterate over the values in the array
        for (let value of terms[key]) {
            // Create an li element with the value as its text content
            let li = document.createElement('li');
            li.textContent = value;
 
            // Append the li element to the ul element
            ul.appendChild(li);
        }
 
        // Append the h2 and ul elements to the div element
        div.appendChild(h2);
        div.appendChild(ul);
 
        // Append the div element to the container
        container.appendChild(div);
    }
 }