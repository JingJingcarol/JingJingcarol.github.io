var camera, scene, renderer, controls;
var raycaster;
var mouse = new THREE.Vector2();
var mesh = [];

function init() {
    // scene

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x03286a, 500, 10000);

    // camera
    camera = new THREE.OrthographicCamera(window.innerWidth / -6, window.innerWidth / 6, window.innerHeight / 6, window.innerHeight / -6, 1, 10000)
        //	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(200, 250, 200)
    camera.lookAt(new THREE.Vector3(0, 50, 0))
    scene.add(camera);

    // lights

    var light = new THREE.AmbientLight(0x666666);

    scene.add(light);
    // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样  
    var light1 = new THREE.PointLight(0xffffff, 0.8);
    light1.position.set(0, 0, 1000);
    scene.add(light1);
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(0, 1000, 0);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff, 0.4);
    light.position.set(1000, 0, 0);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff, 0.3);
    light.position.set(0, 0, -1000);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff, 0.2);
    light.position.set(-1000, 0, 0);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    raycaster = new THREE.Raycaster();
    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    // 使动画循环使用时阻尼或自转 意思是否有惯性 
    // controls.enableDamping = true; 
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度 
    //controls.dampingFactor = 0.25; 
    //是否可以缩放 
    // controls.enableZoom = true; 
    //是否自动旋转 
    // controls.autoRotate = false; 
    //设置相机距离原点的最远距离 
    // controls.minDistance = 200; 
    //设置相机距离原点的最远距离 
    // controls.maxDistance = 6000; 
    //是否开启右键拖拽 
    // controls.enablePan = true; 
}

function animate() {

    requestAnimationFrame(animate);
    // controls.update();
    TWEEN.update();
    render();
}

function bind() {
    document.addEventListener('click', onDocumentMouseMove, false);
    document.addEventListener('keydown', run, false);
}

function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function run(e) {

    var keys = null;
    if (e.which == 16) {
        //shift
        if (people) {

        }
    } else if (e.which == 65) {
        //A
        keys = 'A';
    } else if (e.which == 87) {
        //w
        keys = 'W';
    } else if (e.which == 83) {
        keys = 'S';
    } else if (e.which == 68) {
        keys = 'D';
    }
    if (people) {
        pos = people.userData.pos;
        if (path[pos] && path[pos][keys]) {
            new TWEEN.Tween(people.position)
                .to({ x: path[path[pos][keys]].pos.x, y: path[path[pos][keys]].pos.y, z: path[path[pos][keys]].pos.z }, Math.random() * 500 + 500)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            //			people.position.copy(path[path[pos][keys]].pos)
            people.userData.pos = path[pos][keys]
        }
    }
}

function drawBox(data, opt) {
    var defaultOpt = {
        height: 10
    }
    var options = $.extend({}, defaultOpt, opt);
    var box = new THREE.BoxGeometry(10, options.height, 10);
    var cube = new THREE.Mesh(box, material);
    var group = new THREE.Group();
    for (var i = 0; i < data.length - 1; i++) {
        var count = 0,
            dirt = 0;
        if (data[i + 1][0] - data[i][0] != 0) {
            count = Math.floor(Math.abs(data[i + 1][0] - data[i][0]) / 10) + 1
        } else if (data[i + 1][1] - data[i][1] != 0) {
            count = Math.floor(Math.abs(data[i + 1][1] - data[i][1]) / 10) + 1;
            dirt = 1;
        } else {
            count = Math.floor(Math.abs(data[i + 1][2] - data[i][2]) / 10) + 1;
            dirt = 2;
        }
        for (var j = 0; j < count; j++) {
            var one = cube.clone(true);
            var flag = (dirt == 0 && data[i + 1][0] - data[i][0] > 0) ||
                (dirt == 1 && data[i + 1][1] - data[i][1] > 0) ||
                (dirt == 2 && data[i + 1][2] - data[i][2] > 0) ? 1 : -1;
            var x = dirt == 0 ? data[i][0] + 10 * j * flag : data[i][0];
            var y = dirt == 1 ? data[i][1] + 10 * j * flag : data[i][1];
            var z = dirt == 2 ? data[i][2] + 10 * j * flag : data[i][2];
            one.position.set(x, y, z)
            group.add(one);
            mesh.push(one)
        }
    }

    scene.add(group);
}

function drawRotategroup(data, rotate, opt) {
    var rotate = rotate ? rotate : [0, 0, 0];
    var center = new THREE.Object3D();

    var box = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshLambertMaterial({ color: 0xff24b4 })
        //	material.opacity = 0.9;
        //	material.transparent = true;
    var cube = new THREE.Mesh(box, material);
    cube.position.set(0, 0, 0);
    center.add(cube);
    mesh.push(cube)
    var cube1 = cube.clone(true);
    cube1.position.set(-10, 0, 0);
    center.add(cube1);
    mesh.push(cube1)
    var cube1 = cube.clone(true);
    cube1.position.set(-20, 0, 0);
    center.add(cube1);
    mesh.push(cube1)
        //	var cube1 = cube.clone(true);
        //	cube1.position.set(-30,0,0);
        //	center.add(cube1);
        //	mesh.push(cube1)
    var cube1 = cube.clone(true);
    cube1.position.set(0, 0, -10);
    center.add(cube1);
    mesh.push(cube1)
    var cube1 = cube.clone(true);
    cube1.position.set(0, 0, -20);
    center.add(cube1);
    mesh.push(cube1)
        //	var cube1 = cube.clone(true);
        //	cube1.position.set(0,0,-30);
        //	center.add(cube1);
    mesh.push(cube1)

    center.name = 'turnBrigeX';
    if (opt) {
        if (opt.pedestal) {
            //底座
            var pedestal = opt.pedestal();
            center.add(pedestal);
        }
        if (opt.name) {
            center.name = opt.name
        }
    }

    if (opt && opt.spindle) {
        var spindle = opt.spindle(center, material)
    } else {
        //转轴
        var box = new THREE.CylinderGeometry(1.5, 1.5, 20, 18, 3)
        var cube = new THREE.Mesh(box, material);
        cube.position.set(10, 0, 0);
        cube.rotation.z = Math.PI / 2
        center.add(cube);
        var box = new THREE.CylinderGeometry(1, 1, 14, 18, 3)
        var cube = new THREE.Mesh(box, material);
        cube.position.set(16, 0, 0);
        center.add(cube);
        var cube = cube.clone(true);
        cube.position.set(16, 0, 0);
        cube.rotation.x = Math.PI / 2
        center.add(cube);

        mesh.push(cube)
    }


    center.position.copy(data);
    center.rotation.set(rotate[0], rotate[1], rotate[2]);

    scene.add(center);
}

function drawbsgbox(data) {
    for (var i = 0; i < data.length; i++) {
        var pos = new THREE.Vector3(data[i].pos[0], data[i].pos[1], data[i].pos[2])
        var box = new THREE.BoxGeometry(10, data[i].height, 10);
        var cube = new THREE.Mesh(box, material);
        cube.position.copy(pos);
        var box = new THREE.CylinderGeometry(6, 6, data[i].height - 2, 18, 3)
        var cube1 = new THREE.Mesh(box, material);
        pos.y -= 1;
        cube1.position.copy(pos);
        var bsg1 = new ThreeBSP(cube)
        var bsg2 = new ThreeBSP(cube1)
        var bsg3 = bsg1.subtract(bsg2)
        var bsgmesh = bsg3.toMesh(material);
        scene.add(bsgmesh);
    }
}

function drawContactBox(pos, dir) {
    var dir = dir ? -1 : 1;
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(10, 0);
    shape.lineTo(5 + dir * 5, dir * 10);
    shape.lineTo(0, 0);
    var geometry = new THREE.ExtrudeGeometry(shape, {
        amount: 10,
        bevelEnabled: false
    })
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(pos)
    scene.add(cube);
}

function drawStair(data) {
    for (var i = 0; i < data.length; i++) {
        var rotate = data[i].rotate ? data[i].rotate : new THREE.Vector3(0, 0, 0)
        var one = drawOneStair();
        one.position.copy(data[i].pos)
        one.rotation.set(rotate.x, rotate.y, rotate.z)
        scene.add(one)
    }
}

function drawOneStair() {
    var one = null;
    for (var i = 0; i < 5; i++) {
        var x = i == 0 ? 4 : 2 * (i + 1);
        var box = new THREE.BoxGeometry(x, 2, 10);
        var cube = new THREE.Mesh(box, material);
        var px = i == 0 ? -1 : i;
        cube.position.set(px, -2 * i, 0);
        var bsg = new ThreeBSP(cube);
        if (one) {
            one = one.union(bsg)
        } else {
            one = bsg;
        }
    }
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, -10);
    shape.lineTo(10, -10);
    shape.lineTo(0, 0);
    var geometry = new THREE.ExtrudeGeometry(shape, {
        amount: 10,
        bevelEnabled: false
    })
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(-3, 1, -5);
    var bsg = new ThreeBSP(cube);
    var ret = one.subtract(bsg);
    return ret.toMesh(material)
}

function drawEndPoint(data) {
    var box = new THREE.BoxGeometry(14, 2, 14);
    var texture = THREE.ImageUtils.loadTexture('img/endPoint.png');
    var material = new THREE.MeshLambertMaterial({ map: texture })
    var cube = new THREE.Mesh(box, material);
    cube.position.copy(data)
    scene.add(cube)
}

function drawPeople() {
    var group = new THREE.Object3D();
    var head = new THREE.SphereGeometry(2, 20, 16)
    var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(head, material);
    cube.position.set(0, 0, 0);
    group.add(cube);
    var body = new THREE.CylinderGeometry(0, 2, 6, 18, 3)
    var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(body, material);
    cube.position.set(0, -5, 0);
    group.add(cube);
    var leg = new THREE.CylinderGeometry(1, 1, 4, 18, 3)
    var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(leg, material);
    cube.position.set(0, -9, 0);
    group.add(cube);
    return group;
}

function drawContactshape(pos, rot) {
    var rot = rot ? rot : new THREE.Vector3(0, 0, 0)
    var box = new THREE.BoxGeometry(10, 10, 10);
    var cube = new THREE.Mesh(box, material);
    cube.position.set(0, 0, 0);
    var box = new THREE.CylinderGeometry(8, 8, 10, 18, 3)
    var cube1 = new THREE.Mesh(box, material);
    cube.position.set(-4, 0, -4);
    var bsg = new ThreeBSP(cube)
    var bsg1 = new ThreeBSP(cube1)
    var ret = bsg.subtract(bsg1);
    ret = ret.toMesh(material);
    ret.position.copy(pos);
    ret.rotation.set(rot.x, rot.y, rot.z);
    scene.add(ret);
    //	scene.add(cube1);
}

function drawBtnPoint(data) {
    var box = new THREE.BoxGeometry(6, 2, 6);
    var texture = THREE.ImageUtils.loadTexture('img/btn.png');
    var material = new THREE.MeshLambertMaterial({ map: texture })
    var cube = new THREE.Mesh(box, material);
    cube.position.copy(data.pos)
    cube.name = data.name;
    scene.add(cube)
}

function drawfloor(opt) {
    var defaultopt = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    var options = $.extend(true, defaultopt, opt);

    var floor = new THREE.BoxGeometry(options.width, 1, options.height);
    var floorM = options.material ? options.material : material;
    var cude = new THREE.Mesh(floor, floorM);
    //	cude.rotation.x = Math.PI/2;
    if (options.fn) {
        options.fn(cude)
    }
    scene.add(cude);
}

function getMeshBykey(keys, value) {
    var ret = null;
    for (var i = 0; i < mesh.length; i++) {
        if (keys.indexOf('.') == -1) {
            if (mesh[i][keys] == value) {
                ret = mesh[i]
            }
        } else {
            if (mash[i].userData[keys.split('.')[1]] == value) {
                ret = mesh[i]
            }
        }
    }
    return ret;
}