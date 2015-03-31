
Tree = function(trunkHeight, leafRows) {

    var trunkRad = .07 * trunkHeight;

    var trunkBaseGeo = new THREE.CylinderGeometry(trunkRad,1.4*trunkRad,.4*trunkHeight, 20)
    var trunkBaseMat = new THREE.MeshPhongMaterial({color: 0x533118});
    var trunkBase = new THREE.Mesh(trunkBaseGeo, trunkBaseMat);

    var trunkGeo = new THREE.CylinderGeometry(trunkRad,trunkRad,.6*trunkHeight, 20)
    var trunkMat = new THREE.MeshPhongMaterial({color: 0x533118});
    var trunk = new THREE.Mesh(trunkGeo, trunkMat);

    var leafBunchGeo = new THREE.SphereGeometry(trunkRad*2.5, 30, 30);
    var leafBunchMat = new THREE.MeshPhongMaterial({color: 0x3A5F0B});
    var leafBunch = new THREE.Mesh(leafBunchGeo, leafBunchMat);


    var tree_group = new THREE.Group();


    tree_group.add(trunkBase);

    trunk.position.set(0,.4*trunkHeight, 0);
    tree_group.add(trunk);

    //Leaf bunches
    leafBunch.position.set(0,trunkHeight + trunkRad, 0);

    for(var i = 0; i< leafRows; i++){
        var n = (i+1) * 2;
        for(var j = 0; j < n; j++){
            var bunch = leafBunch.clone();
            bunch.rotateY(THREE.Math.degToRad(j*360/n));
            bunch.translateX(i * trunkRad * 1.5);
            tree_group.add(bunch);
        }
        leafBunch.translateY(-trunkHeight/(2*leafRows));
    }


    return tree_group;
}

/* Inherit Helicopter from THREE.Object3D */
Tree.prototype = Object.create (THREE.Object3D.prototype);
Tree.prototype.constructor = Tree;