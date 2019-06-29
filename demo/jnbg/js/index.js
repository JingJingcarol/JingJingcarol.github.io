
$(function(){
	init()
	drawMap()
	animate()
	bind()
})

var material = new THREE.MeshLambertMaterial({color:0x81fff2})
var people = null;
var path = {
	p1:{pos:new THREE.Vector3(20,20,35),A:'p2'},
	p2:{pos:new THREE.Vector3(10,20,35),A:'p3',D:'p1'},
	p3:{pos:new THREE.Vector3(55,80,95),A:'p4',D:'p2'},
	p4:{pos:new THREE.Vector3(45,80,95),A:'p5',D:'p3'},
	p5:{pos:new THREE.Vector3(35,80,95),D:'p4',W:'p6'},
	p6:{pos:new THREE.Vector3(35,80,85),W:'p7',S:'p5'},
	p7:{pos:new THREE.Vector3(35,80,75),W:'p8',S:'p6'},
	p8:{pos:new THREE.Vector3(35,80,65),S:'p7'},
	p9:{pos:new THREE.Vector3(35,80,55),W:'p10',S:'p8'},
	p10:{pos:new THREE.Vector3(35,80,45),W:'p11',S:'p9'},
	p11:{pos:new THREE.Vector3(35,80,35),S:'p10',A:'p12'},
	p12:{pos:new THREE.Vector3(25,80,35),A:'p13',D:'p11'},
	p13:{pos:new THREE.Vector3(15,80,35),A:'p14',D:'p12'},
	p14:{pos:new THREE.Vector3(5,80,35),A:'p15',D:'p13'},
	p15:{pos:new THREE.Vector3(55,140,95),A:'p16',D:'p14'},
	p16:{pos:new THREE.Vector3(45,140,95),A:'p17',D:'p15'},
	p17:{pos:new THREE.Vector3(35,140,95),D:'p16',W:'p18'},
	p18:{pos:new THREE.Vector3(35,150,85),S:'p17',W:'p19'},
	p19:{pos:new THREE.Vector3(35,160,75),S:'p18',W:'p20'},
	p20:{pos:new THREE.Vector3(35,170,65),S:'p19',W:'p21'},
	p21:{pos:new THREE.Vector3(35,171,55),S:'p20',W:'p22'},
	p22:{pos:new THREE.Vector3(35,171,42),end:true},
	p23:{pos:new THREE.Vector3(35,80,25),W:'p24',S:'p11'},
	p24:{pos:new THREE.Vector3(35,80,15),S:'p23'},
}

function drawMap(){
	drawBox([[35,35,35],[35,5,35],[-15,5,35]])
	drawContactBox(new THREE.Vector3(-30,0,30))
	drawRotategroup(new THREE.Vector3(35,65,35),[-Math.PI/2,0,0])
	drawBox([[35,65,65],[35,65,95]])
	drawContactBox(new THREE.Vector3(40,70,90),true)
//	drawBox([[55,85,105],[55,85,105]])
	drawBox([[5,65,35],[-5,65,35]])
//drawContactBox(new THREE.Vector3(-20,70,30))
	drawBox([[35,125,95],[45,125,95]])
	drawContactBox(new THREE.Vector3(50,130,90),true)
	drawbsgbox([{pos:[35,95,95],height:50}])
	
	drawStair([
		{pos:new THREE.Vector3(35,139,80),rotate:new THREE.Vector3(0,-Math.PI/2,0)},
		{pos:new THREE.Vector3(35,149,70),rotate:new THREE.Vector3(0,-Math.PI/2,0)},
		{pos:new THREE.Vector3(35,159,60),rotate:new THREE.Vector3(0,-Math.PI/2,0)}])
	drawBox([[35,159,54],[35,159,54]],{height:2})
	
	drawEndPoint(new THREE.Vector3(35,159,42))
	people = drawPeople();
	people.position.set(20,20,35);
	people.userData.pos = 'p1';
	scene.add(people)
}

function render(){
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( mesh );

	if ( intersects.length > 0 ) {

		var intersect = intersects[ 0 ];
		if(intersect.object.parent.name == 'turnBrigeX'){
			if(people.userData.pos != 'p9' && people.userData.pos != 'p10' && people.userData.pos != 'p11'
				&& people.userData.pos != 'p12' && people.userData.pos != 'p13' && people.userData.pos != 'p23'
				&& people.userData.pos != 'p24'){
					new TWEEN.Tween( intersect.object.parent.rotation )
						.to( { x: intersect.object.parent.rotation.x + Math.PI/8, y: intersect.object.parent.rotation.y, z: intersect.object.parent.rotation.z }, Math.random() * 500 + 500 )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();
//					intersect.object.parent.rotation.x += Math.PI/8;
					if(parseFloat(intersect.object.parent.rotation.x - Math.PI + Math.PI/8).toFixed(2)%parseFloat(Math.PI * 2).toFixed(2) == 0){
						intersect.object.parent.rotation.x = Math.PI;
						path.p8.W = 'p9';
						path.p11.W = false;
						path.p11.S = 'p10'
					}else if(parseFloat(intersect.object.parent.rotation.x + Math.PI/8).toFixed(2)%parseFloat(Math.PI * 2).toFixed(2) == 0){
						intersect.object.parent.rotation.x = 0
						path.p11.W = 'p23';
						path.p11.S = false;
						path.p8.W = false;
					}else{
						path.p8.W = false;
						path.p11.S = false;
						path.p11.W = false;
					}
				}
			
		}
		
		mouse.x = -10000;
		mouse.y = -10000;
	} 

	renderer.render( scene, camera );
}
