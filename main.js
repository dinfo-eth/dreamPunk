var selectionWrap = document.getElementsByClassName('selectionWrap')[0];
let gender = "f";
let traitsJson;


async function getPunkTraits(){

  if (gender === "f") {
    traitsJson = ["gender","body","accessories", "hair","mouth","nose","eyes"];
  } else {
    traitsJson = ["gender","body","accessories","eyes", "beard", "hair","mouth","nose"];
  }

  for (var i = 0; i < traitsJson.length; i++) {

    var response = await fetch(`./punks/${gender}/${traitsJson[i]}.json`);
    var mytrait = await response.json();

    var optionsWrap = document.createElement('DIV');
        optionsWrap.className = "optionsWrap";
        selectionWrap.appendChild(optionsWrap);

    var myLabel = document.createElement('LABEL');
        myLabel.innerText = traitsJson[i];
        optionsWrap.appendChild(myLabel);

    var mySelector = document.createElement('select');
        mySelector.setAttribute('data-option', traitsJson[i]);
        mySelector.className = "mySelector";

        if(traitsJson[i] === "gender"){
          mySelector.onchange = function(){
            gender = this.value;
            selectionWrap.innerHTML = "";
            layersArray = {body:"",hair:"",nose:"",mouth:"",beard:"",eyes:""};
            getPunkTraits();
          }
        } else {
          mySelector.onchange = pickTrait;
        }
        optionsWrap.appendChild(mySelector);

    if (i != 0){
      var myoption = document.createElement('option');
          myoption.value = "None";
          myoption.setAttribute('data-option', traitsJson[i]);
          myoption.innerText = "None";
          mySelector.appendChild(myoption);
    }

    for (var m = 0; m < mytrait.length; m++) {

      var myoption = document.createElement('option');
          myoption.value = mytrait[m].fileId;
          myoption.innerText = mytrait[m].fileId;
          if(mytrait[m].fileId == gender){
            myoption.setAttribute('selected', "selected");
          }
          mySelector.appendChild(myoption);

    }
  }
}

function pickTrait(){
  var theoption = this.getAttribute('data-option');

  if (this.value !== "None") {
    var mysrc = `/punks/${gender}/${theoption}/${this.value}.png`;
        layersArray[theoption] = mysrc;
        console.log(theoption);

  } else {
    console.log("select an option");
    console.log(theoption);
    layersArray[theoption] = "";

  }
  drawMe();
}


getPunkTraits()


var canvasSize = 600;

var layersArray = {body:"",hair:"",nose:"",mouth:"",beard:"",eyes:""};

async function drawMe(mysrc){

  var mycanvas = document.getElementById('canvas');
      mycanvas.width = mycanvas.height = canvasSize;
  var context = mycanvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.webkitImageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;

      context.fillStyle='#638596';
      context.fillRect(0,0,canvas.width,canvas.height);

  for (var key in layersArray) {

    if (layersArray[key] !== "") {

      let myimg = layersArray[key];
          myimg = new Image();
          myimg.src = layersArray[key];
          myimg.className = "traitImg";
          await myimg.decode();
          context.drawImage(myimg, 0, 0, canvasSize, canvasSize);

    }
  }
}
function downloadToad(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'MyDreamPunk.png');
    let canvas = document.getElementById('canvas');
    canvas.toBlob(function(blob) {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
}
function svgPunk(){
    //let downloadLink = document.createElement('a');
    //downloadLink.setAttribute('download', 'MyDreamPunk.png');

    let canvas = document.getElementById('canvas');
    // https://github.com/jankovicsandras/imagetracerjs functions from this library.
    d = ImageTracer.getImgdata(canvas);
    svg = ImageTracer.imagedataToSVG(d);
    console.log(svg);
    let svgDisplay = document.getElementById('svgHolder');
    svgDisplay.innerHTML = svg;

    // console.log('inside svgpunk');
    // canvas.toBlob(function(blob){
    //   console.log(blob);
    //   svg = ImageTracer.getImgdata(blob);
    //   console.log(svg)
    // });

}
