
// define sone variables for later
let terms = {}; // this will hold the JSON data
const termsURL = 'https://raw.githubusercontent.com/MediumBob/PraiseTheMessage/main/assets/json/terms.json'; // URL for json data
const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");
const searchIcon = document.querySelector(".fa-solid.fa-magnifying-glass");

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



// user presses the search icon
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

// SECOND ATTEMPT
// inputBox.addEventListener('keydown', function(e) {
//     if (e.key === 'Enter') {
//         e.preventDefault();
//         if (selectedTerm) {
//             // If a term is selected, search for it
//             const keys = search(selectedTerm);
//             if (keys) {
//                 showResult(keys);
//                 console.log(`The corresponding keys are: ${keys}`);
//             } else {
//                 console.log(`No corresponding keys found for: ${selectedTerm}`);
//             }
//         } else {
//             // If no term is selected, search for the first term in the list
//             const firstResult = document.querySelector(".result-box li:first-child");
//             if (firstResult) {
//                 selectInput(firstResult);
//                 highlightDiv(firstResult.textContent);
//             }
//         }
//         resultsBox.innerHTML = '';
//     }
//  });
//THIRTD ATTEMPT
// Variable to keep track of the currently selected term
let selectedTermIndex = -1;

// Modify the keydown event handler
// inputBox.addEventListener('keydown', function(e) {
//   switch(e.key) {
//       case 'ArrowUp':
//           // Move to the previous term
//           if (selectedTermIndex > 0) {
//               selectedTermIndex--;
//               selectInput(document.querySelectorAll(".result-box li")[selectedTermIndex]);
//           }
//           break;
//       case 'ArrowDown':
//           // Move to the next term
//           if (selectedTermIndex < document.querySelectorAll(".result-box li").length - 1) {
//               selectedTermIndex++;
//               selectInput(document.querySelectorAll(".result-box li")[selectedTermIndex]);
//           }
//           break;
//       case 'Enter':
//           e.preventDefault();
//           if (selectedTermIndex >= 0) {
//               // If a term is selected, search for it
//               const keys = search(selectedTerm);
//               if (keys) {
//                  showResult(keys);
//                  console.log(`The corresponding keys are: ${keys}`);
//               } else {
//                  console.log(`No corresponding keys found for: ${selectedTerm}`);
//               }
//           }
//           break;
//   }
// });

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
    // if(!result.length){
    //     resultsBox.innerHTML = '';
    // }
}

/**
 * 
 * @param {*} result 
 */
// function display(result){
//     const content = result.map((list)=>{
//         return "<li onclick=selectInput(this)>" + list.toLowerCase() + "</li>";
//     });
//     resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
// }
function display(result){
    // Remove duplicates
    const uniqueResult = Array.from(new Set(result));
    const content = uniqueResult.map((list)=>{
        return "<li onclick=selectInput(this)>" + list.toLowerCase() + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
 }


 let selectedTerm = null;

/**
 * 
 * @param {*} list 
 */
// function selectInput(list){
//     let searchTerm = list.innerHTML;
//     let key = search(searchTerm);
//     if (key) {
//         showResult(key);
//         console.log(`The corresponding key is: ${key}`);
//     } else {
//         console.log(`No corresponding key found for: ${searchTerm}`);
//     }
//     inputBox.value = searchTerm;
//     resultsBox.innerHTML = '';
// }
function selectInput(list){
    let searchTerm = list.innerHTML;
    let keys = search(searchTerm);
    if (keys) {
        showResult(keys);
        console.log(`The corresponding keys are: ${keys}`);
    } else {
        console.log(`No corresponding keys found for: ${searchTerm}`);
    }
    inputBox.value = searchTerm;
    resultsBox.innerHTML = '';
    selectedTerm = searchTerm; // Update the selected term
 }

// function search(searchTerm) {
//     for (let [key, value] of Object.entries(terms)) {
//         let found = value.find(item => item.toLowerCase() === searchTerm.toLowerCase());
//         if (found) {
//             return key;
//         }
//     }
//     return null;
//  }
function search(searchTerm) {
    let keys = [];
    for (let [key, value] of Object.entries(terms)) {
        let found = value.some(item => item.toLowerCase() === searchTerm.toLowerCase());
        if (found) {
            keys.push(key);
        }
    }
    return keys.length ? keys : null;
 }

 //FIXME this should show all instances of the word and highlight them accordingly, instead of just the first one
//  function showResult(key) {
//     const resultBox = document.querySelector(".res-box");
//     resultBox.innerHTML = key;
//   }
  function showResult(keys) {
    const resultBox = document.querySelector(".res-box");
    resultBox.innerHTML = keys.join(', ');
       // Add CSS properties
    resultBox.style.border = "3px solid";
    resultBox.style.borderColor = "rgb(208, 171, 109)";
    resultBox.style.borderRadius = "15px";
 }

 function highlightDiv(result) {
    // Check if the result is a valid string
    if (typeof result !== 'string') {
        console.log('Invalid result:', result);
        return;
    }
  
    // Use a valid CSS selector
    const divs = document.querySelectorAll('.terms li');
  
    // Check if any divs were selected
    if (!divs.length) {
        console.log('No divs selected');
        return;
    }
  
    // Highlight divs that contain the result
    divs.forEach(div => {
        if (div.textContent.includes(result)) {
            div.classList.add('highlight');
        }
    });
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


//  ------------
// Get the search input field
const inputField = document.querySelector("#input-box");

// Add an event listener for the focus event
inputField.addEventListener("focus", () => {
 // If the input field is empty
 if (!inputField.value) {
  // Get all values from the terms dictionary
  const values = Object.values(terms).flat();
  // Call the display function with all values
  display(values);
 }
});

// Add an event listener for the input event
inputField.addEventListener("input", () => {
 // If the input field is empty
 if (!inputField.value) {
  // Get all values from the terms dictionary
  const values = Object.values(terms).flat();
  // Call the display function with all values
  display(values);
 }
});