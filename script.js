$(window).on('scroll',function() {
    if (checkVisible($('#middle'))) {
        alert("Visible!!!");
        $(window).off('scroll');
    } else {
        // do nothing
    }
});
var currentSection = "start"
function swap( ele ) {
    let name = `${ele}` + "FixedImage"
    var element =  document.getElementById(`${currentSection}FixedImage`)
    currentSection = ele
    element.id = name
    console.log(name)
    if(name == "middleFixedImage" || name == "endFixedImage") {
        element.style.animation = "none";
        element.style.animation = "moveIn 3s linear";
        element.addEventListener('animationend', () => {
            element.style.animation = "none";
        });
    } else if(name == "startFixedImage") {
        element.style.animation = "9s ease-in-out 1s infinite alternate bounce";
        element.addEventListener('animationend', () => {
            element.style.animation = "animation: 9s ease-in-out 1s infinite alternate bounce";
        });
    }
}