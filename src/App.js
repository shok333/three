import React, {useState, useEffect} from 'react';
import * as THREE from 'three';

import './App.css';

const schemaHeight = 6136;
const schemaWidth = 5078;

function getSchemeIndex () {
  if (window.innerWidth / schemaWidth < window.innerHeight / schemaHeight) {
    return window.innerWidth / schemaWidth;
  } else {
    return window.innerHeight / schemaHeight;
  }
}

const canvasRenderIndex = getSchemeIndex()

// function calculatePosition () {
//   if (window.innerWidth - schemaWidth * canvasRenderIndex > window.innerHeight - schemaHeight * canvasRenderIndex) {
//     return {
//       left: (window.innerWidth - schemaWidth * canvasRenderIndex) / 2,
//       top: 0,
//     }
//   } else {
//     return {
//       left: 0,
//       top: (window.innerHeight - schemaHeight * canvasRenderIndex) / 2,
//     }
//   }
// }

// const position = calculatePosition();
let coord = {x: 0, y: 0};
let isDragging = false;
let coordStart = null;

function App() {
  const [seats, setSeats] = useState(null);
  const [camera, setCamera] = useState(null);

  function renderSeat (scene, {centerX, centerY}) {
    // var geometry = new THREE.CircleGeometry( 1, 5 );
    // var material = new THREE.MeshBasicMaterial( { color:0xff0ff0, vertexColors: THREE.FaceColors } );
    // var seat = new THREE.Mesh( geometry, material );

    var spriteMaterial = new THREE.SpriteMaterial( { color: 0xff0ff0 } );
    var seat = new THREE.Sprite( spriteMaterial );

    const x = (centerX - schemaWidth / 2) * canvasRenderIndex * 2;
    const y = (centerY - schemaHeight / 2) * canvasRenderIndex * 2;

    seat.position.x = x;
    seat.position.y = y;

    scene.add( seat );

    return {seat, x, y};
  }
 
  function renderCanvas (res) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('#canvas-container').appendChild( renderer.domElement );

    renderer.setClearColor(new THREE.Color(0x00ffff));

    const seatsObjects = [];

    for (let i = 0; i < 10; i++) {
      res.forEach(({centerX, centerY}) => {
        seatsObjects.push(renderSeat(scene, {centerX: centerX + i * 200, centerY: centerY }));
      });
    }
    let last;

    var render = function (now, cms) {
      if (isDragging) {
        camera.position.x = coord.x;
        camera.position.y = -coord.y;
      }

      requestAnimationFrame( render );

      renderer.render(scene, camera);
    };

    camera.position.z = schemaHeight * canvasRenderIndex;
    render();

    renderer.setClearColor(0x00ffff, 1);
    renderer.setClearColor(new THREE.Color(0x00ffff));

    setCamera(camera);
  }

  useEffect(() => {
    //const url = 'json-file-url';

    if (!seats) {
      fetch(url)
        .then(res => res.json())
        .then((res) => {
          setSeats(res);

          renderCanvas(res);
        });
    }
  });

  return (
    <div className="app">
      <div
        id="canvas-container"
        onMouseDown={(event) => {
          isDragging = true;
          coordStart = {
            x: event.clientX,
            y: event.clientY,
          }
        }}
        onMouseUp={() => {
          isDragging = false;
        }}
        onMouseMove={(event) => {
          // setStartCoord();
          if (isDragging) {
            coord = {
              x: coordStart.x - event.clientX,
              y: coordStart.y - event.clientY,
            }
          }
        }}
      />
      <div className="zoom-buttons">
        <button onClick={() => {
          camera.position.z = schemaHeight * canvasRenderIndex / 4;
        }}>zoom +</button>
        <button onClick={() => {
          camera.position.z = schemaHeight * canvasRenderIndex;
        }}>zoom -</button>
      </div>
    </div>
  );
}

export default App;
