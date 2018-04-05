import * as THREE from "three";
import { Vector3 } from "three";
import p5 from 'p5';

const scene = new THREE.Scene();

var P5 = new p5();

let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 400, 0.5, 1000 );

var lighta = new THREE.AmbientLight( 0x404040 ); // soft white light


scene.add( lighta );

var renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setClearColor( 0x000000, 0 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.setSize( window.innerWidth, 400);

var helper = new THREE.GridHelper( 1000, 100, 0x303030, 0x303030 );
helper.position.y = 0;
// scene.add( helper );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material =  new THREE.LineBasicMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, flatShading: true } ) ;
var cube = new THREE.Mesh( geometry, material );

var light = new THREE.PointLight( 'beige', 1, 0, 2 ); // soft white light
light.position.set(0,500,-900);


var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
 light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 'white' } ) ) );
light.castShadow = true;

light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;       // default
light.shadow.camera.far = 500      // default

scene.add( light );



camera.position.z = 5;
camera.position.y = 600;
camera.position.z = 200;

// let cubes = [];
// for(let i = -5; i < 5; i+=0.51){
//     for(let j = -5; j < 5; j+=0.51){
//         let geo = new THREE.BoxGeometry(0.25,0.25,0.25);
//         let mat = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 'purple', shininess: 10, flatShading: false } ) ;
//         let c = new THREE.Mesh( geo, mat );
//         scene.add(c);
//         c.position.set(i,j,0);
//         cubes.push(c);
//     }
// }


class RectPrism{
    constructor(x,y,z,w,h,d,scene){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.d = d;

        this.geo = new THREE.BoxGeometry(1,1,1);
        this.mat = new THREE.MeshPhongMaterial( { color: "white", specular: 'white', shininess: 1, flatShading: false } ) ;
        this.c = new THREE.Mesh( this.geo,this.mat );
        this.c.position.set(x,y+h/2,z);
        this.c.castShadow = true;
        this.c.receiveShadow = true;
        scene.add(this.c);

        this.c.scale.x = w;
        this.c.scale.y = h;
        this.c.scale.z = d;
    }

    setHeight(h){
         this.h = h;
         //this.y = this.y+h/2;
         this.c.position.set(this.x,this.y + h/2,this.z);
         this.c.scale.y = h;
    }
}


let array = [];
for(let j = 0; j > -20;j--){
    let row = [];
    for(let i = -50; i < 50; i++){
        row.push(new RectPrism(i*50,0,j*40,50,40,40,scene));
    }
    array.push(row);
}

console.log(array);


// let t = new RectPrism(0,0,-80,10,10,10,scene);
//  t.setHeight(45);



window.addEventListener("mousemove", (e)=>{
    console.log("move");
    console.log(e.clientX,e.clientY);

})


document.getElementById("three-canvas").appendChild(renderer.domElement);

window.addEventListener("resize",() => {
    renderer.setSize( window.innerWidth, 400);
    camera.aspect = window.innerWidth/400;
    camera.updateProjectionMatrix();
})

let i = 0;
function animate() {
	requestAnimationFrame( animate );
    renderer.render( scene, camera );

    // cubes.forEach((cube) => {
    //     cube.rotation.x += 0.01/cube.position.y;
    //     cube.rotation.y += 0.01/cube.position.x;
    // })
    //  t.setHeight(P5.map(P5.noise(i),0,1,10,40));

    for(let q = 0; q < array.length; q++){
        let row = array[q];
        for(let r = 0; r < row.length; r++){
            row[r].setHeight(P5.map(P5.noise(q/20+(i-r/1)),0,1,5,(q+1)*25));
        }
    }
    i+= 0.01;
}
animate();


