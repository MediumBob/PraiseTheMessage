
// define sone variables for later

//const inputBox = document.getElementById("input-box");
//const resultsBox = document.querySelector(".result-box");
//const searchIcon = document.querySelector(".fa-solid.fa-magnifying-glass");

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


 //FIXME this should show all instances of the word and highlight them accordingly, instead of just the first one
//  function showResult(key) {
//     const resultBox = document.querySelector(".res-box");
//     resultBox.innerHTML = key;
//   }


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
  
    // Highlight divs that contain the result
    divs.forEach(div => {
        if (div.textContent.includes(result.toLowerCase())) {
            div.classList.add('highlight');
        }
    });
  }


//  ------------
// Get the search input field
const inputField = document.querySelector("#input-box");



//--------------------------------------------------------------------------------



// MOUSE BUTTON EVENT
inputBox.addEventListener('click', function(event){
    if (!inputBox.contains(event.target)){
        HideOptions();
    }
});


// INPUT BOX FOCUS EVENT
// is the user focusing the search bar?
inputBox.addEventListener('focus', function(){
    // is the user already focused on the search bar?
    if(!SEARCH_BAR_FOCUSED){
        // autocomplete based on current input
        ShowOptions(currentText);
        SEARCH_BAR_FOCUSED = true;
    }
    else if(SEARCH_BAR_FOCUSED){
        //no op - if the user is already focused on the search bar, do nothing
    }
    else{
        // the user is clicking outside the search bar - hide the autocomplete results
        HideOptions();
        SEARCH_BAR_FOCUSED = false;
    }
});




// ARROW KEYS PRESSED   
// is the search bar currently focused?
if(SEARCH_BAR_FOCUSED){

}
else{
    // the search bar is not currently focused
}






