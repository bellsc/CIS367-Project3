
Helicopter = function(mainBlades, tailBlades) {

    var heliColor = 0x9B1730;

    var bodyGeo = new THREE.SphereGeometry(1, 30, 30);
    var bodyMat = new THREE.MeshPhongMaterial({color: heliColor});
    var body = new THREE.Mesh(bodyGeo, bodyMat);

    var tailGeo = new THREE.CylinderGeometry(.7,.15,7.5, 20)
    var tailMat = new THREE.MeshPhongMaterial({color: heliColor});
    var tail = new THREE.Mesh(tailGeo, tailMat);

    var tailPieceGeo = new THREE.CubeGeometry(1,1,1);
    var tailPieceMat = new THREE.MeshPhongMaterial({color: heliColor});
    var tailPiece = new THREE.Mesh(tailPieceGeo, tailPieceMat);

    var propBaseGeo = new THREE.CubeGeometry(2.5,.5, 1.4);
    var propBaseMat = new THREE.MeshPhongMaterial({color: heliColor});
    var propBase = new THREE.Mesh(propBaseGeo, propBaseMat);

    var mainProp = Propeller(mainBlades, 7);
    var tailProp = Propeller(tailBlades, 3);

    var skidGeo = new THREE.CubeGeometry(5.2,.1,.25);
    var skidMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var skid = new THREE.Mesh(skidGeo, skidMat);

    var skidConnectGeo = new THREE.CylinderGeometry(.1,.1,1.2, 20)
    var skidConnectMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var skidConnect = new THREE.Mesh(skidConnectGeo, skidConnectMat);

    var spotlightBulbGeo = new THREE.SphereGeometry(.148, 10, 10);
    var spotlightBulbMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var spotlightBulb = new THREE.Mesh(spotlightBulbGeo, spotlightBulbMat);

    var spotlightGeo = new THREE.CylinderGeometry(.15,.3,.3, 20, 20, true)
    var spotlightMat = new THREE.MeshPhongMaterial({color: 0x848484});
    var spotlight = new THREE.Mesh(spotlightGeo, spotlightMat);


    var helicopter_group = new THREE.Group();
    var mainProp_cf = new THREE.Matrix4();
    var tailProp_cf = new THREE.Matrix4();

    mainProp_cf.multiply(new THREE.Matrix4().makeTranslation(0, 2.05, 0));
    tailProp_cf.makeTranslation(-7.3,.8,.17);
   // tailProp_cf.multiply(new THREE.Matrix4().makeScale(.3,.6,.3));
    tailProp_cf.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));



    var spotlight_cf = new THREE.Matrix4();
    spotlight_cf.multiply(new THREE.Matrix4().makeTranslation(3.1, -1.2,0));
    spotlight_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(35)));


    var tran = new THREE.Vector3();
    var quat = new THREE.Quaternion();
    var rot = new THREE.Quaternion();
    var vscale = new THREE.Vector3();



    body.scale.set(4, 1.8, 1.4);
    helicopter_group.add(body);

    tail.scale.set(1,.8,.6);

    tail.position.set(-4.4,.8, 0);
    tail.rotateZ(-Math.PI/2);
    helicopter_group.add(tail);

    propBase.position.set(-.5, 1.6, 0);
    helicopter_group.add(propBase);



    var botTail = tailPiece.clone();
    botTail.position.set(-7.4,.4, 0);
    botTail.rotateZ(-Math.PI / 4.5);
    botTail.scale.set(.3,.8,.07);
    helicopter_group.add(botTail);

    var topTail = tailPiece.clone();
    topTail.position.set(-7.4,1.2, 0);
    topTail.rotateZ(Math.PI / 4.1);
    topTail.scale.set(.3, 1.4,.07);
    helicopter_group.add(topTail);


    //Propellers
   // mainProp.position.set(0, 2.1, 0);
    mainProp_cf.decompose (tran, quat, vscale);
    mainProp.position.copy(tran);
    mainProp.quaternion.copy(quat);
    helicopter_group.add(mainProp);

    //tailProp.position.set(-7.3,.8,.17);

    //tailProp.rotateX(Math.PI / 2);
    tailProp_cf.decompose (tran, quat, vscale);

    tailProp.position.copy(tran);
    tailProp.quaternion.copy(quat);
    tailProp.scale.set(.3,.6,.3);
    helicopter_group.add(tailProp);


    //Skids
    var skidConBackLeft = skidConnect.clone();
    skidConBackLeft.position.set(-1.5, -1.5, -.9);
    skidConBackLeft.rotateX(Math.PI / 9);
    helicopter_group.add(skidConBackLeft);

    var skidConFrontLeft = skidConBackLeft.clone();
    skidConFrontLeft.translateX(3);
    helicopter_group.add(skidConFrontLeft);

    var skidConBackRight = skidConnect.clone();
    skidConBackRight.position.set(-1.5, -1.5,.9);
    skidConBackRight.rotateX(-Math.PI / 9);
    helicopter_group.add(skidConBackRight);

    var skidConFrontRight = skidConBackRight.clone();
    skidConFrontRight.translateX(3);
    helicopter_group.add(skidConFrontRight);

    var leftSkid = skid.clone();
    leftSkid.position.set(.4,-2.05, -1.07);
    helicopter_group.add(leftSkid);

    var rightSkid = skid.clone();
    rightSkid.position.set(.4,-2.05, 1.07);
    helicopter_group.add(rightSkid);

    //Spotlight
    spotlight_cf.decompose (tran, quat, vscale);
    spotlight.position.copy(tran);
    spotlight.quaternion.copy(quat);




    //spotlightBulb.position.copy(tran);
    //spotlightBulb.quaternion.copy(quat);


    var frontLight	= new THREE.SpotLight('white', 1, 0, Math.PI / 6);
    frontLight.target = spotlight;
   // frontLight.position.copy(tran);
    //frontLight.quaternion.copy(quat);
   // frontLight.rotateY(Math.PI * 1.2);
    //frontLight.rotateZ(Math.PI * 1.2);
   // frontLight.position.set(0,.5, 0);


    //spotlightBulb.rotateY(Math.PI/4) ;

    spotlightBulb.add( frontLight );
    spotlightBulb.add ( new THREE.SpotLightHelper (frontLight, 1));
    spotlight.add(spotlightBulb);
    helicopter_group.add(spotlight);
    //helicopter_group.add ( new THREE.SpotLightHelper (frontLight, 1));


    return {
        model : helicopter_group,
        mainProp_cf: mainProp_cf,
        tailProp_cf: tailProp_cf,
        mainProp: mainProp,
        tailProp: tailProp

    };
}

/* Inherit Helicopter from THREE.Object3D */
Helicopter.prototype = Object.create (THREE.Object3D.prototype);
Helicopter.prototype.constructor = Helicopter;