
getPunkTraits();
// getTraits();

var selectionWrap = document.getElementsByClassName('selectionWrap')[0];

async function getPunkTraits(){

  const traitsJson = ["female","male","eyes","hair","mouth", "nose","accessories","beard" ];

  for (var i = 0; i < traitsJson.length; i++) {

    var response = await fetch(`./punktraits/${traitsJson[i]}.json`);
    var mytrait = await response.json();

    var optionsWrap = document.createElement('DIV');
        optionsWrap.className = "optionsWrap";
        selectionWrap.appendChild(optionsWrap);

    var myLabel = document.createElement('LABEL');
        // myLabel.setAttribute("for", mytrait[i].name);
        myLabel.innerText = traitsJson[i];
        optionsWrap.appendChild(myLabel);

    var mySelector = document.createElement('select');
        mySelector.onchange = pickTrait;
        mySelector.setAttribute('data-option', traitsJson[i]);
        mySelector.className = "mySelector";
        // mySelector.setAttribute("name", mytrait[i].name);
        optionsWrap.appendChild(mySelector);

    var myoption = document.createElement('option');
        myoption.value = "None";
        myoption.setAttribute('data-option', traitsJson[i]);
        myoption.innerText = "None";
        mySelector.appendChild(myoption);

    for (var m = 0; m < mytrait.length; m++) {

      var myoption = document.createElement('option');
          myoption.value = mytrait[m].fileId;
          myoption.innerText = mytrait[m].fileId;
          mySelector.appendChild(myoption);

    }
  }
}




async function getTraits(){

  const traitsJson = ["background","body","head","eyes","mouth","hoodies","accessory_one"];

  for (var i = 0; i < traitsJson.length; i++) {

    var response = await fetch(`./traits/${traitsJson[i]}.json`);
    var mytrait = await response.json();

    var optionsWrap = document.createElement('DIV');
        optionsWrap.className = "optionsWrap";
        selectionWrap.appendChild(optionsWrap);

    var myLabel = document.createElement('LABEL');
        myLabel.setAttribute("for", mytrait[i].name);
        myLabel.innerText = traitsJson[i];
        optionsWrap.appendChild(myLabel);

    var mySelector = document.createElement('select');
        mySelector.onchange = pickTrait;
        mySelector.setAttribute('data-option', traitsJson[i]);
        mySelector.className = "mySelector";
        mySelector.setAttribute("name", mytrait[i].name);
        optionsWrap.appendChild(mySelector);

    var myoption = document.createElement('option');
        myoption.value = "None";
        myoption.setAttribute('data-option', traitsJson[i]);
        myoption.innerText = "None";
        mySelector.appendChild(myoption);

    for (var m = 0; m < mytrait.length; m++) {

      var myoption = document.createElement('option');
          myoption.value = mytrait[m].fileId;
          myoption.innerText = mytrait[m].fileId;
          mySelector.appendChild(myoption);

    }
  }
}

function pickTrait(){
  var theoption = this.getAttribute('data-option');

  if (this.value !== "None") {
    var mysrc = `/punktraits/${theoption}/${this.value}.png`;
        layersArray[theoption] = mysrc;
        console.log(theoption);

  } else {
    console.log("select an option");
    console.log(theoption);
    layersArray[theoption] = "";

  }
  drawToad();
}

var canvasSize = 600;

var layersArray = {male:"",female:"",eyes:"",beard:"",hair:"",eyes:"",nose:"",mouth:""};

async function drawToad(mysrc){

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
