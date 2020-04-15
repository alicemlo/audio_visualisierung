// CREATE SONGS
let songs= {
  nr0: {
    titel: "Frequency Spectrum" , src: "Spectrum.mp3"
  },
  nr1: {
    titel: "Seen a Good Man by Swain" , src: "Seen-a-Good-Man.mp3"
  },
  nr2: {
    titel: "Come On Down", src: "ComeOnDown.mp3"
  },
  nr3: {
    titel: "Nazareth" , src: "Nazareth.mp3"
  },
  nr4: {
    titel: "rainbow" , src: "rainbow.mp3"
  },
  nr5: {
    titel: "Sacrilegium by Zeal&Ardor" , src:"Sacrilegium.mp3"
  },
  nr6: {
    titel: "Beethoven" , src:"beethoven.mp3"
  },
  nr7: {
    titel: "bohemian rhapsody" , src:"queen.mp3"
  },
  nr8: {
    titel: "tonleiter" , src:"tonleiter_01.mp3"
  }
}

document.getElementById('btnCreateCtx').addEventListener('click', function() {
  document.getElementById('btnCreateCtx').style.display ="none";

  //create Context, audio and analyser
  let ctx = new AudioContext();
  let audio = document.getElementById('myAudio');
  let audioSrc = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();

  console.log(audio);
  audioSrc.connect(analyser);
  // audioSrc.connect(ctx.destination);
  analyser.connect(ctx.destination);

  // get Canvas from HTML and create canvasCtx
  let canvas = document.getElementById('canvasCtx');
  let canvasCtx = canvas.getContext("2d");
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  analyser.fftSize = 512;
  let bufferLength = analyser.frequencyBinCount; // frequencyBinCount tells you how many values you'll receive from the analyser
  let frequencyData = new Uint8Array(bufferLength); // The Uint8Array typed array represents an array of 8-bit unsigned integers
  let floatData = new Float32Array(bufferLength);
  let timeData = new Uint8Array(bufferLength);

  // console sample Rate
  // console.log(ctx.sampleRate);

  //var myListener = ctx.listener;

  // PLAY SONG
  for (let song in songs) {
    let btn;
    let buttons = document.createElement("BUTTON");
    buttons.innerHTML = songs[song].titel;
    document.body.appendChild(buttons);

    let source = songs[song].src;
    btn = buttons;

    btn.addEventListener("click", function(){
      audio.src = "songs/"+source;
      console.log(audio);
      audio.play();
    });
  }

  // STOP SONG
  document.getElementById('btnStop').addEventListener("click", function(){
    audio.pause();
  });

  // DRAW
  function draw() {
     drawVisual = requestAnimationFrame(draw);
     canvasCtx.fillStyle = 'rgb(0, 0, 0)';
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // console.log(frequencyData);

     // Lautstärke berechnen (Summe aller Amplituden)
     const reducer = (accumulator, currentValue) => accumulator + currentValue;
     let amplitude = (frequencyData.reduce(reducer)/bufferLength);

     analyser.getFloatFrequencyData(floatData);
     // console.log(floatData);
     //ANIMATION RECT
     canvasCtx.fillRect(0, 0, WIDTH, HEIGHT); // 0 0 --> position WIDTH HEIGHT --> höhe breite

     analyser.getByteTimeDomainData(timeData);
     //console.log(timeData);

     // get current Time
     // console.log(ctx.currentTime);

     // bufferLength ist fftSize/2
     let barWidth;
     let barHeight = (HEIGHT / bufferLength);
     let y = HEIGHT; // y für y-position der bars

     for(let i = 0; i < bufferLength; i++) {

         barWidth = frequencyData[i]*3.1372;

         canvasCtx.fillStyle = 'rgb(' + (255-frequencyData[i]) + ',' +(frequencyData[i]-40)+',' +frequencyData[i] +')';

         canvasCtx.fillRect(0,y,barWidth,barHeight); // ctx.fillRect(x, y, largeur, hauteur);

         // x ist Abstand zwischen Bars
         y = y-(barHeight*2);

         canvasCtx.beginPath();
         canvasCtx.arc((canvas.width / 2), (canvas.height / 2), amplitude, 0, 2 * Math.PI);
         canvasCtx.lineWidth = 1;
         canvasCtx.strokeStyle = '#FFFFFF';
         canvasCtx.stroke();
      }
  } // END DRAW

  draw();

});
