$(function(){
	init()
	drawMap()
	animate()
	bind()
//	camera.position.set(200,250,200)
//	camera.lookAt(new THREE.Vector3(0,50,0))
})

var material = new THREE.MeshLambertMaterial({color:0x81fff2})
var people = null;
var path = {
	p1:{pos:new THREE.Vector3(-15,35,25)},
	p2:{pos:new THREE.Vector3(-5,35,25)},
	p3:{pos:new THREE.Vector3(5,35,25)},
	p4:{pos:new THREE.Vector3(15,35,25)},
	p5:{pos:new THREE.Vector3(25,35,25)},
	p6:{pos:new THREE.Vector3(25,35,35)},
	p7:{pos:new THREE.Vector3(25,35,45)},
	p8:{pos:new THREE.Vector3(25,35,55)},
	p9:{pos:new THREE.Vector3(25,35,65)},
	p10:{pos:new THREE.Vector3(35,25,65)},
	p11:{pos:new THREE.Vector3(35,15,65)},
	p12:{pos:new THREE.Vector3(45,15,65)},
	p13:{pos:new THREE.Vector3(55,15,65)},
}
function drawMap(){
//	drawfloor({material : new THREE.MeshLambertMaterial({color:0xDBDBDB})})
	drawBox([[45,5,75],[35,5,75]])
	drawBox([[25,15,75],[25,15,65]],{height:30})
	drawContactshape(new THREE.Vector3(25,25,55),new THREE.Vector3(Math.PI/2,0,-Math.PI/2))
	drawRotategroup(new THREE.Vector3(25,25,25),[0,Math.PI,0],{
		name:'turnBrigeY'
		,pedestal:function(){
			var box = new THREE.CylinderGeometry(15, 15, 20, 18, 3)
			var cube1 = new THREE.Mesh( box, material );
			cube1.position.set(0,-15,0)
			return cube1
		}
		,spindle:function(group,material){
			var box = new THREE.BoxGeometry(10, 20, 10);
			var cube1 = new THREE.Mesh( box, material );
			cube1.position.set(0,15,0)
			var Cyl = new THREE.CylinderGeometry(6, 6, 18, 18, 3)
			var Cylcube = new THREE.Mesh( Cyl, material );
			Cylcube.position.set(0,14,0);
			var bsg1 = new ThreeBSP(cube1)
			var bsg2 = new ThreeBSP(Cylcube)
			var bsg3 = bsg1.subtract( bsg2 )
			var bsgmesh = bsg3.toMesh(material);
			group.add(bsgmesh)
			var box = new THREE.CylinderGeometry(1.5, 1.5, 10, 18, 3)
			var cube = new THREE.Mesh( box, material );
			cube.position.set(0,30,0);
			group.add(cube)
			var box = new THREE.CylinderGeometry(1, 1, 14, 18, 3)
			var cube = new THREE.Mesh( box, material );
			cube.position.set(0,30,0);
			cube.rotation.z = Math.PI/2
			group.add(cube);
			var cube = cube.clone(true);
			cube.position.set(0,30,0);
			cube.rotation.y = Math.PI/2
			group.add(cube);

		}
		
	})
	
	drawBox([[-25,15,25],[-15,15,25]],{height:30})
	drawContactshape(new THREE.Vector3(-5,25,25),new THREE.Vector3(0,Math.PI/2,-Math.PI/2))
	drawBox([[-25,35,25],[-25,75,25]])
	drawContactshape(new THREE.Vector3(-15,75,25),new THREE.Vector3(0,Math.PI/2,-Math.PI/2))
	drawBox([[-5,79,25],[-5,79,25]],{height:2})
	drawbsgbox([{pos:[-25,90,25],height:20}])
	drawBox([[-25,79,15],[-25,79,-25],[25,79,-25]],{height:2})
	drawContactshape(new THREE.Vector3(25,75,-15),new THREE.Vector3(0,0,-Math.PI/2))
	drawBox([[25,79,-5],[25,79,-5]],{height:2})
	drawbsgbox([{pos:[-25,90,-25],height:20}])
	drawbsgbox([{pos:[25,90,-25],height:20}])
	drawBox([[25,75,-25],[25,65,-25]])
	drawbsgbox([{pos:[25,45,-25],height:30}])
	drawBox([[25,25,-25],[25,5,-25]])
	drawBtnPoint({pos:new THREE.Vector3(45,11,75),name:'btn1'})
	drawEndPoint(new THREE.Vector3(-25,79,-25))
	//楼梯
	var texture =  new THREE.TextureLoader().load('img/shair.png');
//	texture.repeat.set( 1,4 );
	var shairmaterial = new THREE.MeshLambertMaterial({map:texture,fog:false,deeptest:true})
//	shairmaterial.opacity = 0;
	shairmaterial.transparent = true;
	drawfloor({width:10,height:20,material:shairmaterial,fn:function(cude){
		cude.position.set(30,20,75);
		
		cude.rotation.x = Math.PI/2
		cude.rotation.z = Math.PI/2
	}})
	//pess btn1
	drawBox([[25,25,-15],[25,25,-5],[45,25,-5],[45,5,-5]])
	drawBox([[15,25,-25],[5,25,-25]])
	drawBtnPoint({pos:new THREE.Vector3(45,31,-5),name:'btn2'})
}
function render(){
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( mesh );

	if ( intersects.length > 0 ) {

		var intersect = intersects[ 0 ];
		if(intersect.object.parent.name == 'turnBrigeY'){
			new TWEEN.Tween( intersect.object.parent.rotation )
						.to( { x: intersect.object.parent.rotation.x , y: intersect.object.parent.rotation.y + Math.PI/8, z: intersect.object.parent.rotation.z }, Math.random() * 500 + 500 )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();
		}
		
		mouse.x = -10000;
		mouse.y = -10000;
	} 

	renderer.render( scene, camera );
}

