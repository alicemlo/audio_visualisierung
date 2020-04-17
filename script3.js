// CREATE SONGS
let songs= {
  nr3: {
    titel: "Nazareth" , src: "Nazareth.mp3"
  },
  nr5: {
    titel: "Sacrilegium by Zeal&Ardor" , src:"Sacrilegium.mp3"
  },
  nr6: {
    titel: "Beethoven" , src:"beethoven.mp3"
  },
  nr7: {
    titel: "bohemian rhapsody" , src:"queen.mp3"
  }
}
document.getElementById('btnCreateCtx').addEventListener('click', function() {
  document.getElementById('btnCreateCtx').style.display ="none";

  var w = window.innerWidth;
  var h = window.innerHeight;


  //create Context, audio and analyser
  let ctx = new AudioContext();
  let audio = document.getElementById('myAudio');
  let audioSrc = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();

  //console.log(audio);
  audioSrc.connect(analyser);
  // audioSrc.connect(ctx.destination);
  analyser.connect(ctx.destination);

  analyser.fftSize = 1024;
  let bufferLength = analyser.frequencyBinCount; // frequencyBinCount tells you how many values you'll receive from the analyser
  let frequencyData = new Uint8Array(bufferLength); // The Uint8Array typed array represents an array of 8-bit unsigned integers
  let timeData = new Uint8Array(bufferLength);

  // console sample Rate
  // console.log(ctx.sampleRate);

  // PLAY SONG
  for (let song in songs) {
    let btn;
    let buttons = document.createElement("BUTTON");
    let container = document.getElementById('beethoven');
    buttons.innerHTML = songs[song].titel;
    document.body.appendChild(buttons);

    let source = songs[song].src;
    btn = buttons;

    btn.addEventListener("click", function(){
      audio.src = "songs/"+source;
      // console.log(audio);
      audio.play();
    });
  }

  // STOP SONG
  document.getElementById('btnStop').addEventListener("click", function(){
    audio.pause();
    let spans = document.getElementsByTagName("SPAN");
    for (var i = 0; i < spans.length; i++) {
       document.body.removeChild(spans[i]);
      //spans[i].classList.add('inactive');
    }
  });


  let volHistory = [];
  let count = 0;
  // DRAW
  function draw(amplitude) {

       if(audio.paused == false){
         if(count>50){
           volHistory.shift(); // löscht erstes Element
         }else{
           count++;
         }

         volHistory.push(amplitude);

         for (var i = 0; i < volHistory.length; i++) {
          // console.log(volHistory[i]);
          r=volHistory[i]*6;
          let x = r*Math.sin(i)+(h/2);
          let y =r*Math.cos(i)+(w/2);

          let span = document.createElement("SPAN");
          span.style.top=x+'px';
          span.style.left=y+'px';
          span.style.backgroundColor = 'rgb('+(255-(volHistory[i]*3))+','+0+' ,'+255+')';
          span.classList.add('fade');
          document.body.appendChild(span);
         }
       }

  } // END DRAW

  function rechner(){
      requestAnimationFrame(rechner);
      analyser.getByteFrequencyData(frequencyData);
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let amplitude = (frequencyData.reduce(reducer)/bufferLength);
      draw(amplitude);
  }

  rechner();

});
