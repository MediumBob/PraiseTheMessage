let images = document.querySelectorAll(".background");

let imageIndex = 0;

function ChangeBackground(){
    images[imageIndex].classList.remove("showing");
    imageIndex++;
    if (imageIndex >= images.length){
        imageIndex = 0;
    }

    images[imageIndex].classList.add("showing");
}

setInterval(ChangeBackground, 4500);
