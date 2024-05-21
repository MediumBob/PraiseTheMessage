// let terms = {}; // this will hold the JSON data
// const termsURL = 'https://raw.githubusercontent.com/MediumBob/PraiseTheMessage/main/assets/json/terms.json'; // URL for json data

// // fetch terms.json from the remote repository
// getTerms(termsURL)
//   .then(data => {
//        // load data from terms.json into a javascript variable
//        terms = data;
//        // add lists of the terms under the search bar
//        populateHTML(terms);
//   })
//   .catch(error => {
//        console.error('Error:', error);
//   });


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

/**
 * 
 * @param {*} terms 
 */
  function populateHTML(terms) {
    // Get the container where the divs will be added
    const container = document.querySelector('#grid');
 
    // Iterate over the keys and values in the terms object
    for (let key in terms) {
        // Create a new div element with the class 'terms' and the key as its class name
        let div = document.createElement('div');
        div.className = 'terms ' + key.toLowerCase().replace(/\s+/g, ''); // remove whitespace from the key
        // Set the grid-area property to match the grid area names defined in CSS
       // div.style.gridArea = key.toLowerCase().replace(/\s+/g, ''); // remove whitespace from the key;
 
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
