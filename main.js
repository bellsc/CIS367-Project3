require([], function(){
    // detect WebGL
    if( !Detector.webgl ){
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }
    // setup webgl renderer full page
    var pauseAnim = false;
    var renderer	= new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    // setup a scene and camera
    var scene	= new THREE.Scene();
    var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);

    camera_cf = new THREE.Matrix4();
    camera_cf.multiply(new THREE.Matrix4().makeTranslation(0, 0,3));
    //camera.position.z = 3;

    // declare the rendering loop
    var onRenderFcts= [];

    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera)

    //////////////////////////////////////////////////////////////////////////////////
    //		default 3 points lightning					//
    //////////////////////////////////////////////////////////////////////////////////

    var ambientLight= new THREE.AmbientLight( 0x020202 )
    scene.add( ambientLight)
    var frontLight	= new THREE.DirectionalLight('white', 1)
    frontLight.position.set(0.5, 0.5, 2)
    scene.add( frontLight )
    var backLight	= new THREE.DirectionalLight('white', 0.75)
    backLight.position.set(-0.5, -0.5, -2)
    scene.add( backLight )

    //var backLightd	= new THREE.Light('white', 0.75)

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////
    var geometry	= new THREE.CubeGeometry( 1, 1, 1);
    // var geometry	= new Propeller(4, 2);
    var material	= new THREE.MeshPhongMaterial();
    var mesh	= new THREE.Mesh( geometry, material );
    //scene.add( mesh );


    var heli_cf = new THREE.Matrix4();

    scene.add (new THREE.AxisHelper(4));

    var groundPlane = new THREE.PlaneBufferGeometry(40, 40, 10, 10);
    /* attach the texture as the "map" property of the material */
    var groundMat = new THREE.MeshPhongMaterial({color: 0x019917});
    var ground = new THREE.Mesh (groundPlane, groundMat);
    ground.position.set(0, -.42, 0);
    ground.rotateX(THREE.Math.degToRad(-90));
    scene.add (ground);




    //Make helicopter
    var heli = new Helicopter(4, 2);
    heli.model.scale.set(.2,.2,.2);
   // heli_cf.multiply(new THREE.Matrix4().makeRotationY(-Math.PI /4));

    scene.add(heli.model);

    var tree = new Tree(14, 3);
    tree.scale.set(.2,.2,.2);
    tree.position.set(2, 0, 0);
    scene.add(tree);

    onRenderFcts.push(function(delta, now){

        var tran = new THREE.Vector3();
        var quat = new THREE.Quaternion();
        var rot = new THREE.Quaternion();
        var vscale = new THREE.Vector3();

        //always allow moving camera
        camera_cf.decompose(tran, quat, vscale);
        camera.position.copy(tran);
        camera.quaternion.copy(quat);
        if (pauseAnim) return;




        //logic for changing helicopter position  (physics stuff)

        //Whole Helicopter
        heli_cf.decompose(tran, quat, vscale);
        heli.model.position.copy(tran);
        heli.model.quaternion.copy(quat);

        //Main propeller
        heli.mainProp_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(delta * 72)));
        heli.mainProp_cf.decompose(tran, quat, vscale);
        heli.mainProp.position.copy(tran);
        heli.mainProp.quaternion.copy(quat);

        //Tail propeller
        heli.tailProp_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(delta * 72)));
        heli.tailProp_cf.decompose(tran, quat, vscale);
        heli.tailProp.position.copy(tran);
        heli.tailProp.quaternion.copy(quat);


        //heli_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(delta * 72)));
        //heli_cf.decompose(tran, quat, vscale);
        //heli.model.position.copy(tran);
        //heli.model.quaternion.copy(quat);
//
//        /* TODO: when animation is resumed after a pause, the arm jumps */
//        var curr_angle = 40.0 * Math.cos(now);
//        arm_cf.copy(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(curr_angle)));
//        arm_cf.decompose (tran, quat, vscale);
////        rot.setFromAxisAngle( new THREE.Vector3(0,0,1), THREE.Math.degToRad(arm_angle));
//        arm.position.copy(tran);
//        arm.quaternion.copy(quat);
    });


    //Spins the example cube
    onRenderFcts.push(function(delta, now){
        mesh.rotateX(0.5 * delta);
        mesh.rotateY(2.0 * delta);
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    //var mouse	= {x : 0, y : 0}
    //document.addEventListener('mousemove', function(event){
    //    mouse.x	= (event.clientX / window.innerWidth ) - 0.5
    //    mouse.y	= (event.clientY / window.innerHeight) - 0.5
    //}, false)
    //onRenderFcts.push(function(delta, now){
    //    //camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
    //    //camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
    //    //var x = camera.position.x + (mouse.x*5 - camera.position.x) * (delta*3);
    //    //var y = camera.position.y + (mouse.y*5 - camera.position.y) * (delta*3);
    //    //camera_cf.multiply(new THREE.Matrix4().makeRotationX(x));
    //    //camera_cf.multiply(new THREE.Matrix4().makeRotationY(y));
    //    //camera.lookAt( scene.position )
    //})

    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
        renderer.render( scene, camera );
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		Rendering Loop runner						//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec	= nowMsec
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })
    document.addEventListener('keypress', function(event){
        //var key = String.fromCharCode(event.keyCode || event.charCode);
        //console.log(key);
        //if (key == 'p') {
        //    pauseAnim ^= true; /* toggle it */
        //}
        //else if (key == 'a') {
        //    heli_cf.multiply(new THREE.Matrix4().makeTranslation(-.2, 0,0));
        //}
        //else if (key == 'd') {
        //    heli_cf.multiply(new THREE.Matrix4().makeTranslation(.2, 0,0));
        //}
    }, false);

    document.onkeydown = function(event){
        var code = event.keyCode;
        console.log(code);
        var key = String.fromCharCode(event.keyCode || event.charCode);
        console.log(key);

        var active_cf ;
        //active_cf = heli_cf;
        //Change active cf if necessary

        //Standard helicopter control uses ctrl key
        if(event.ctrlKey){
            if (code == 37) {  //left
                //camera_cf.multiply(new THREE.Matrix4().makeTranslation(-.2, 0,0));
                heli_cf.multiply(new THREE.Matrix4().makeRotationX(-THREE.Math.degToRad(5)));

            }
            else if (code == 38) { //up
                heli_cf.multiply(new THREE.Matrix4().makeRotationZ(-THREE.Math.degToRad(5)));

            }
            else if (code == 39) { //right
                heli_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(5)));

            }
            else if (code == 40) { //down
                heli_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(5)));

            }

        }

        else {
            active_cf = camera_cf;

            if (event.shiftKey) {
                active_cf = heli_cf;
            }


            //Translate
            if (code == 37) {  //left
                //camera_cf.multiply(new THREE.Matrix4().makeTranslation(-.2, 0,0));
                active_cf.multiply(new THREE.Matrix4().makeTranslation(-.2, 0, 0));

            }
            else if (code == 38) { //up
                active_cf.multiply(new THREE.Matrix4().makeTranslation(0, .2, 0));

            }
            else if (code == 39) { //right
                active_cf.multiply(new THREE.Matrix4().makeTranslation(.2, 0, 0));

            }
            else if (code == 40) { //down
                active_cf.multiply(new THREE.Matrix4().makeTranslation(0, -.2, 0));

            }
            else if (code == 191) { //slash
                active_cf.multiply(new THREE.Matrix4().makeTranslation(0, 0, .2));

            }
            else if (code == 222) { //apostrophe
                active_cf.multiply(new THREE.Matrix4().makeTranslation(0, 0, -.2));

            }

            else if (key == 'P') {
                pauseAnim ^= true;
                /* toggle it */
            }

            //Rotate
            else if (key == 'S') {  //Look down
                active_cf.multiply(new THREE.Matrix4().makeRotationX(-THREE.Math.degToRad(5)));
            }
            else if (key == 'W') {  //Look up
                active_cf.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(5)));
            }
            else if (key == 'D') {  //Look right
                active_cf.multiply(new THREE.Matrix4().makeRotationY(-THREE.Math.degToRad(5)));
            }
            else if (key == 'A') {  //Look left
                active_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(5)));
            }
            else if (key == 'Q') {  //Spin left
                active_cf.multiply(new THREE.Matrix4().makeRotationZ(-THREE.Math.degToRad(5)));
            }
            else if (key == 'E') {  //Spin right
                active_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(5)));
            }
        }
    };

    //document.addEventListener('scroll', function(event){
    //   console.log(event);
    //});



})