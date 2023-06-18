//Variáveis globais
var scene, camera,camera2, mesh;
var meshFloor, ambientLight, light;
var floortexture, personagem, objetoImportado, objetoImportado1, objetoImportado2, objetoImportado3, objetoimportado4, mixerAnimacao, mixerAnimacao1, mixerAnimacao2;
var cameraselecionada=1;
var carro, counterCarro=50, counterCarro2=50, bandeira=false;
var flagCarro=false, espectador1;
var relogio = new THREE.Clock();
var relogio1 = new THREE.Clock();
var relogio2 = new THREE.Clock();
var importer = new THREE.FBXLoader();
var renderer = new THREE.WebGLRenderer();
var keyboard = {};
var player = { height:15.8, speed:2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;


function init(){

	scene = new THREE.Scene();

	//Implementação das camâras
	camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera2= new THREE.OrthographicCamera(window.innerWidth / -3, window.innerWidth / 3, window.innerHeight / 3, window.innerHeight / -3,1,1000 );
	
	//Posição Inicial da Camara2
    camera2.position.z = 1;
    camera2.position.y = 250;
    camera2.lookAt(new THREE.Vector3(0,0,0));
	
	//Implementação da Ambientlight
	ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
	scene.add(ambientLight);
	

	//RED: 0xff0000
	//Implementação da pointlight
	light = new THREE.PointLight(0xff0000, 0.5, 500);
	light.position.set(0,100,0);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 600;
	scene.add(light);
	renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

	//Textura do chão
	var textLoadFloor = new THREE.TextureLoader()
    floorTexture = textLoadFloor.load("Textures/grass.jpg");
	floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 4, 4);
    
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(750, 750, 1, 1),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map:floorTexture,
            
        })
    );
	meshFloor.rotation.x -= Math.PI / 2; 
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    //Boxgeometry para a paisagem
	var skyboxGeometry = new THREE.BoxGeometry(750, 750, 750);
    var skyboxMaterials = [
		new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/front.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/back.bmp"), side:THREE.DoubleSide} ),
		new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/up.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/down.bmp"), side:THREE.DoubleSide} ),
		new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/right.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/left.bmp"), side:THREE.DoubleSide} )        
    ];

    var skyboxMaterial = new THREE.MeshFaceMaterial(skyboxMaterials);
    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

	//Adicionar os carros de corrida
	addcarro();
	addcarro2();

    //Objeto complexo
    CarroComplexo();

	//Adicionar um espectador com animação
	addspectator();

	//Criação do suporte da bandeira
    var suporte = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5,0.5,50,10),
        new THREE.MeshPhongMaterial({color: 0x000000})
    );

    scene.add(suporte);
    suporte.position.set(0, 3/2, 180);
    suporte.receiveShadow = true;
    suporte.castShadow = true;

    //Criação da bandeira bem como a sua textura
    var textureLoader = new THREE.TextureLoader();
    bandeiratexture = textureLoader.load("Textures/bandeira.png");

    bandeira = new THREE.Mesh(
        new THREE.BoxGeometry(7, 6, 0.2),
        new THREE.MeshPhongMaterial(
            {color:0xffffff,
            map:bandeiratexture,
            })
    );
    scene.add(bandeira);
    bandeira.position.set(-3.5, 23.5, 180);
    bandeira.receiveShadow = true;
    bandeira.castShadow = true;

	//Carros objetos complexos
	var novocarro = CarroComplexo();
    scene.add(novocarro);
    novocarro.position.set(10, 2, -45);

	var novocarro1 = CarroComplexo();
    scene.add(novocarro1);
    novocarro1.position.set(10, 2, 65);

	var novocarro2 = CarroComplexo();
    scene.add(novocarro2);
    novocarro2.position.set(-15, 2, -65);
	novocarro2.rotation.y -= Math.PI;

	var novocarro3 = CarroComplexo();
    scene.add(novocarro3);
    novocarro3.position.set(-15, 2, 45);
	novocarro3.rotation.y -= Math.PI;

	var novocarro4 = CarroComplexo();
    scene.add(novocarro4);
    novocarro4.position.set(10, 2, -175);

	var novocarro5 = CarroComplexo();
    scene.add(novocarro5);
    novocarro5.position.set(-15, 2, -175);
	novocarro5.rotation.y -= Math.PI;


	//Árvores chamadas
    var novaArvore = Arvore();
    scene.add(novaArvore);
    novaArvore.position.set(5, 15, -2);

    var novaArvore1 = Arvore();
    scene.add(novaArvore1);
    novaArvore1.position.set(5, 13, -120);

    var novaArvore2 = Arvore();
    scene.add(novaArvore2);
    novaArvore2.position.set(5, 17, 120);

    var novaArvore3 = Arvore();
    scene.add(novaArvore3);
    novaArvore3.position.set(290, 19, 120);

    var novaArvore4 = Arvore();
    scene.add(novaArvore4);
    novaArvore4.position.set(290, 22, 10);

    var novaArvore5 = Arvore();
    scene.add(novaArvore5);
    novaArvore5.position.set(290, 30, -100);

			
	camera.position.set(0,player.height ,-215);
	camera.lookAt(new THREE.Vector3(0,player.height ,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1480, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	animate();
}


//Importar o rato
function addrato()
{	
	importer.load('./Objetos/ratocapoeira.fbx', function (espectador) {

	//O mixerAnimação é inicialização tendo em conta o objeto importado

		mixerAnimacao = new THREE.AnimationMixer(espectador);
		var action = mixerAnimacao.clipAction(espectador.animations[0]);
		action.play();			

	espectador.traverse(function (child) {
								
		if (child.isMesh) {
								
				child.castShadow = true;
				child.receiveShadow = true;
						}
					});
								
									
				scene.add(espectador);
									
				espectador.scale.x = 0.15;
				espectador.scale.z = 0.15;
				espectador.scale.y = 0.15;
					
				espectador.position.x = 100;
				espectador.position.y = 0.1;
				espectador.position.z = 180;
				espectador.rotation.y -= Math.PI/2;			
							
				objetoImportado = espectador;
									
				});	

}

function addrato2()
{	
	importer.load('./Objetos/ratocapoeira.fbx', function (espectador1) {

	//O mixerAnimação é inicialização tendo em conta o objeto importado
			mixerAnimacao1 = new THREE.AnimationMixer(espectador1);
			var action = mixerAnimacao1.clipAction(espectador1.animations[0]);
			action.play();		

			espectador1.traverse(function (child) {
								
		if (child.isMesh) {
								
				child.castShadow = true;
				child.receiveShadow = true;
						}
					});
								
									
				scene.add(espectador1);
									
				espectador1.scale.x = 0.15;
				espectador1.scale.z = 0.15;
				espectador1.scale.y = 0.15;
					
				espectador1.position.x = -100;
				espectador1.position.y = 0.1;
				espectador1.position.z = 180;
				espectador1.rotation.y = Math.PI/2;			
							
				objetoImportado1 = espectador1;
									
				});	

}


function addcarro()
{	
	importer.load('./Objetos/policecar.fbx', function (espectador2) {

	var textureLoader = new THREE.TextureLoader();
    cartexture = textureLoader.load("Textures/police.png");


	espectador2.traverse(function (child) {
								
		if (child.isMesh) {
								
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = new THREE.MeshStandardMaterial({
					map:       cartexture,
				});

						}
					});
								
									
				scene.add(espectador2);
							
				espectador2.scale.x = 015;
				espectador2.scale.z = 015;
				espectador2.scale.y = 015;

				espectador2.position.x = 50;
				espectador2.position.y = 0.5;
				espectador2.position.z = -170;
				espectador2.rotation.x += Math.PI/2;
				espectador2.rotation.z -= Math.PI/2;

							
				objetoImportado2 = espectador2;
									
				});	

}

function addcarro2()
{	
	importer.load('./Objetos/racecar.fbx', function (espectador3) {

	var textureLoader1 = new THREE.TextureLoader();
    racecartexture = textureLoader1.load("Textures/racecar.png");


	espectador3.traverse(function (child) {
								
		if (child.isMesh) {
								
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = new THREE.MeshStandardMaterial({
					map:       racecartexture,
				});

						}
					});
								
									
				scene.add(espectador3);
							
				espectador3.scale.x = 015;
				espectador3.scale.z = 015;
				espectador3.scale.y = 015;

				espectador3.position.x = -50;
				espectador3.position.y = 0.5;
				espectador3.position.z = -170;
				espectador3.rotation.x += Math.PI/2;
				espectador3.rotation.z -= Math.PI/2;

							
				objetoImportado3 = espectador3;
									
				});	

}

function addspectator()
{	
	importer.load('./Objetos/clap.fbx', function (espectador4) {

		mixerAnimacao2 = new THREE.AnimationMixer(espectador4);
		var action = mixerAnimacao2.clipAction(espectador4.animations[0]);
		action.play();


		espectador4.traverse(function (child) {
								
		if (child.isMesh) {					
				child.castShadow = true;
				child.receiveShadow = true;				
						}
					});
					
				scene.add(espectador4);
							
				espectador4.scale.x = 0.15;
				espectador4.scale.z = 0.15;
				espectador4.scale.y = 0.15;

				espectador4.position.x = -140;
				espectador4.position.y = 0.5;
				espectador4.position.z = -140;
				espectador4.rotation.y = Math.PI/2;			

				objetoImportado4 = espectador4;
									
				});	

}


function Arvore(){

    //Implementamos a árvore com o tronco e a sua textura e depois criamos 3 tamanhos de folhas

    const arvore = new THREE.Group();

    const folhas = new THREE.Mesh(
        new THREE.ConeGeometry(20,20,8),
        new THREE.MeshPhongMaterial({color: 0x228b22})
    );

    const folhas1 = new THREE.Mesh(
        new THREE.ConeGeometry(12,10,8),
        new THREE.MeshPhongMaterial({color: 0x228b22})
    );

    const folhas2 = new THREE.Mesh(
        new THREE.ConeGeometry(9,12,8),
        new THREE.MeshPhongMaterial({color: 0x228b22})
    );

    folhas.position.y = 30.4;
    folhas.position.x = -150.4;
    folhas1.position.y = 35.4;
    folhas1.position.x = -150.4;
    folhas2.position.y = 41.4;
    folhas2.position.x = -150.4;


    var textureLoader = new THREE.TextureLoader();
    troncotexture = textureLoader.load("Textures/tronco.jpg");

    tronco = new THREE.Mesh(
        new THREE.CylinderGeometry(5,5,80,50),
        new THREE.MeshPhongMaterial(
            {color:0xffffff,
            map:troncotexture,
            })
    );


    tronco.receiveShadow = true;
    tronco.castShadow = true;

    tronco.position.x = -150.4;

    folhas.castShadow = true;
    folhas.receiveShadow = false;

    arvore.add(folhas);
    arvore.add(folhas1);
    arvore.add(folhas2);
    arvore.add(tronco);

    return arvore;
}

//CARRO COMPLEXO
function CarroComplexo(){
	
	const carro = new THREE.Group();
    
	var textureLoader = new THREE.TextureLoader();
    roda1texture = textureLoader.load("Textures/pneu.jpg");

	const roda1 = new THREE.Mesh(
        new THREE.CylinderGeometry(6,6,4,100),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:roda1texture})
    );

	roda1.receiveShadow = true;
    roda1.castShadow = true;

	roda1.position.x = -130;
	roda1.position.y = 3;
	roda1.position.z = 0;
	roda1.rotation.x -= Math.PI / 2;


	var textureLoader = new THREE.TextureLoader();
    roda2texture = textureLoader.load("Textures/pneu.jpg");

	const roda2 = new THREE.Mesh(
        new THREE.CylinderGeometry(6,6,4,100),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:roda2texture})
    );

	roda2.receiveShadow = true;
    roda2.castShadow = true;

	roda2.position.x = -130;
	roda2.position.y = 3;
	roda2.position.z = -30;
	roda2.rotation.x -= Math.PI / 2;


	var textureLoader = new THREE.TextureLoader();
    roda3texture = textureLoader.load("Textures/pneu.jpg");

	const roda3 = new THREE.Mesh(
        new THREE.CylinderGeometry(6,6,4,100),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:roda3texture})
    );

	roda3.receiveShadow = true;
    roda3.castShadow = true;

	roda3.position.x = -170;
	roda3.position.y = 3;
	roda3.position.z = 0;
	roda3.rotation.x -= Math.PI / 2;


	var textureLoader = new THREE.TextureLoader();
    roda4texture = textureLoader.load("Textures/pneu.jpg");

	const roda4 = new THREE.Mesh(
        new THREE.CylinderGeometry(6,6,4,100),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:roda4texture})
    );

	roda4.receiveShadow = true;
    roda4.castShadow = true;

	roda4.position.x = -170;
	roda4.position.y = 3;
	roda4.position.z = -30;
	roda4.rotation.x -= Math.PI / 2;


	var textureLoader = new THREE.TextureLoader();
    fundacaotexture = textureLoader.load("Textures/carro.jpg");

	const fundacao = new THREE.Mesh(
        new THREE.BoxGeometry(40,3,30),
        new THREE.MeshPhongMaterial({color: 0xff0000, map:fundacaotexture})
    );

	fundacao.receiveShadow = true;
    fundacao.castShadow = true;

	fundacao.position.x = -150;
	fundacao.position.y = 5;
	fundacao.position.z = -15;


	var textureLoader = new THREE.TextureLoader();
    frentetexture = textureLoader.load("Textures/carro.jpg");

	const frente = new THREE.Mesh(
        new THREE.BoxGeometry(10,9,30),
        new THREE.MeshPhongMaterial({color: 0xff0000, map:frentetexture})
    );

	frente.receiveShadow = true;
    frente.castShadow = true;

	frente.position.x = -135;
	frente.position.y = 10;
	frente.position.z = -15;

	var textureLoader = new THREE.TextureLoader();
    trastexture = textureLoader.load("Textures/carro.jpg");

	const tras = new THREE.Mesh(
        new THREE.BoxGeometry(10,9,30),
        new THREE.MeshPhongMaterial({color: 0xff0000, map:trastexture})
    );

	tras.receiveShadow = true;
    tras.castShadow = true;

	tras.position.x = -165;
	tras.position.y = 10;
	tras.position.z = -15;


	var textureLoader = new THREE.TextureLoader();
    tetotexture = textureLoader.load("Textures/carro.jpg");

	const teto = new THREE.Mesh(
        new THREE.BoxGeometry(40,3,30),
        new THREE.MeshPhongMaterial({color: 0x000000, map:tetotexture})
    );

	teto.receiveShadow = true;
    teto.castShadow = true;

	teto.position.x = -150;
	teto.position.y = 35;
	teto.position.z = -15;


	var textureLoader = new THREE.TextureLoader();
    pilar1texture = textureLoader.load("Textures/metal.jpg");
	
	const pilar1 = new THREE.Mesh(
        new THREE.CylinderGeometry(1,1,20),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:pilar1texture})
    );

	pilar1.receiveShadow = true;
    pilar1.castShadow = true;

	pilar1.position.x = -132;
	pilar1.position.y = 24;
	pilar1.position.z = -2;
	

	var textureLoader = new THREE.TextureLoader();
    pilar2texture = textureLoader.load("Textures/metal.jpg");

	const pilar2 = new THREE.Mesh(
        new THREE.CylinderGeometry(1,1,20),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:pilar2texture})
    );

	pilar2.receiveShadow = true;
    pilar2.castShadow = true;

	pilar2.position.x = -132;
	pilar2.position.y = 24;
	pilar2.position.z = -28;
	

	var textureLoader = new THREE.TextureLoader();
    pilar3texture = textureLoader.load("Textures/metal.jpg");

	const pilar3 = new THREE.Mesh(
        new THREE.CylinderGeometry(1,1,20),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:pilar3texture})
    );

	pilar3.receiveShadow = true;
    pilar3.castShadow = true;

	pilar3.position.x = -168;
	pilar3.position.y = 24;
	pilar3.position.z = -2;
	

	var textureLoader = new THREE.TextureLoader();
    pilar4texture = textureLoader.load("Textures/metal.jpg");

	const pilar4 = new THREE.Mesh(
        new THREE.CylinderGeometry(1,1,20),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:pilar4texture})
    );

	pilar4.receiveShadow = true;
    pilar4.castShadow = true;

	pilar4.position.x = -168;
	pilar4.position.y = 24;
	pilar4.position.z = -28;


	var textureLoader = new THREE.TextureLoader();
    volantetexture = textureLoader.load("Textures/volante.jpg");

	const volante = new THREE.Mesh(
        new THREE.TorusGeometry(4,1,20, 100),
        new THREE.MeshPhongMaterial({color: 0xffffff, map:volantetexture})
    );

	volante.receiveShadow = true;
    volante.castShadow = true;

	volante.position.x = -141;
	volante.position.y = 15;
	volante.position.z = -22;

	volante.rotation.y -= Math.PI / 2;

	const farol1 = new THREE.Mesh(
        new THREE.CylinderGeometry(2,2,2,100),
        new THREE.MeshPhongMaterial({color: 0xFFFFFF})
    );

	farol1.receiveShadow = true;
    farol1.castShadow = true;

	farol1.position.x = -130;
	farol1.position.y = 11;
	farol1.position.z = -7;
	farol1.rotation.z -= Math.PI / 2;

	const farol2 = new THREE.Mesh(
        new THREE.CylinderGeometry(2,2,2,100),
        new THREE.MeshPhongMaterial({color: 0xFFFFFF})
    );

	farol2.receiveShadow = true;
    farol2.castShadow = true;

	farol2.position.x = -130;
	farol2.position.y = 11;
	farol2.position.z = -23;
	farol2.rotation.z -= Math.PI / 2;
	

	carro.add(farol1);
	carro.add(farol2);
	carro.add(volante);
	carro.add(pilar1);
	carro.add(pilar2);
	carro.add(pilar3);
	carro.add(pilar4);
	carro.add(teto);
	carro.add(frente);
	carro.add(tras);
	carro.add(fundacao);
	carro.add(roda1);
	carro.add(roda2);
	carro.add(roda3);
	carro.add(roda4);

	return carro;
}


function finishline(){

	var textureLoader = new THREE.TextureLoader();
	finishlinetexture = textureLoader.load("Textures/checkers.jpg");

	finishline = new THREE.Mesh(
		new THREE.BoxGeometry(7, 6, 0.2),
		new THREE.MeshPhongMaterial(
			{color:0xffffff, map:finishlinetexture
						})
	);

	scene.remove(bandeira);
	scene.add(finishline);
	finishline.position.set(-3.5, 23.5, 180);
	finishline.receiveShadow = true;
	finishline.castShadow = true;
}



function animate(){
	
	// Necessário atualizar o mixerAnimação tendo em conta o tempo desde o ultimo update.
    // relogio.getDelta() indica quanto tempo passou desde o último frame renderizado.
    if(mixerAnimacao) {
        mixerAnimacao.update(relogio.getDelta());
    }
	if(mixerAnimacao1) {
        mixerAnimacao1.update(relogio1.getDelta());
    }
	if(mixerAnimacao2) {
        mixerAnimacao2.update(relogio2.getDelta());
    }

	//teclas para movimentar a camera
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}

	
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	render();
}



document.addEventListener('keydown', ev=>{
	var coords = {
        x:0,
        y:0,
        z:0
    };
	// await new Promise(resolve => setTimeout(resolve, 15))
	//Fazer o carro andar na SpaceKey
	if(ev.keyCode == 32)
	{
		if(counterCarro != 0){
		if(objetoImportado2!= null)
		{
			objetoImportado2.position.z += 10;
			counterCarro--
		}
		}

		if(counterCarro==16)
		{
			if(objetoImportado2!= null)
			{
				finishline()
				addrato()
				mixerAnimacao1.update(relogio1.getDelta);
				counterCarro--
			}
		}
	}
	//Fazer o carro andar no ENTER
	if(ev.keyCode==13)
	{
		if(counterCarro2 != 0){
			if(objetoImportado3!= null)
			{
				objetoImportado3.position.z += 10;
				counterCarro2--
			}
			}
	
			if(counterCarro2==16)
			{
				if(objetoImportado3!= null)
				{
					finishline()
					addrato2()
					mixerAnimacao2.update(relogio2.getDelta);
					counterCarro2--
				}
			}
	}
});


//Funções para deixarmos as teclas premidas
function keyDown(event){
	keyboard[event.keyCode] = true;
}


function keyUp(event){
	keyboard[event.keyCode] = false;
}


//Desligar a point light
function turnLightOff(){
    if(light.visible == true)
    light.visible = false;
    else
    light.visible = true;
}


//Desligar a ambient light
function turnAmbientLightOff(){
    if(ambientLight.visible == true)
        ambientLight.visible = false;
    else
        ambientLight.visible = true;
}


//Alternar entre a camera perspetiva e ortográfica
function alternarCamera()
	{
		if(cameraselecionada==1)
		{
			cameraselecionada=2;
		}
		else{
			cameraselecionada=1;
		}
	}


function render(){
        if(cameraselecionada==1)
        {
            renderer.render(scene, camera);
        }
        else{
            renderer.render(scene, camera2);
        }

}
	

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);


window.onload = init;