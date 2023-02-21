window.addEventListener('load', (event) => {
  console.log('The page has fully loaded');
});
window.onload = (event) => {
  const waterContainers = document.querySelectorAll('.water-container');

waterContainers.forEach(waterContainer => {
  const water = waterContainer.querySelector('.water');
  
  // Set the water level to a percentage between 1 and 100
  const waterPercentage = getComputedStyle(water).getPropertyValue('--water-fill');
  water.style.height = `${waterPercentage}%`;
  var musicPlayer = document.getElementById("music");
  musicPlayer.volume = 0.1;
});

};

function zanName() {
  if(document.getElementById("zanN").innerHTML == "<a>????</a>"){
    var x = document.getElementById("zanN");
    x.innerHTML = "<a >『　　』</a>";
  }
  else{
    var x = document.getElementById("zanN");
    x.innerHTML = "<a>????</a>";
  }
}


function zanStatus() {
  if(document.getElementById("zanS").innerHTML == "<a>Gone</a>"){
    var x = document.getElementById("zanS");
    x.innerHTML = "<a>At Peace</a>";
  }
  else{
    var x = document.getElementById("zanS");
    x.innerHTML = "<a>Gone</a>";
  }
}


function zanRelationship() {
  if(document.getElementById("zanR").innerHTML == "<a>Betrayed</a>"){
    var x = document.getElementById("zanR");
    x.innerHTML = "<a>Unknown</a>";
  }
  else{
    var x = document.getElementById("zanR");
    x.innerHTML = "<a>Betrayed</a>";
  }
}

