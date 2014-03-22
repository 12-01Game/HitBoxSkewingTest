/*
 *	ShadowScript.js
 *
 *	Version 1.0
 *	Coded with <3 by Jonathan Ballands && Wil Collins
 *
 *	Written for the 12:01 video game for CS 4644
 */

#pragma strict
 
var objToWallDistance : float;		// Stores how far away the GameObject's back edge is from the wall
var scalingWidthVar : float;		// Stores how the shadow should scale in size with respect to the size of the GameObject
var scalingHeightVar : float;		// Stores how the shadow should scale in size with respect to the size of the GameObject
var shadowTexture : Material;		// Stores the texture for the shadow
var reverseTriWinding : boolean;	// This prevents the "backfacing" problem
var player : Transform;				// Stores the player object to detect distance

private var heightScaleOffset : float;		// This is here so that scaled shadows still line up against the wall!

// GUI
private var gui : GameObject;
private var sliderValue : float;

// Object properties
private var objWidth : float;		// Stores the GameObject's width
private var objHeight : float;		// Stores the GameObject's height

private var objOriginX : float;		// Stores where the GameObject is in space
private var objOriginY : float;		// Stores where the GameObject is in space
private var objOriginZ : float;		// Stores where the GameObject is in space

// Shadow properties
private var shadowMesh : Mesh;
private var shadow : GameObject;

// Skewing variables
private var vertices : Vector3[];
private var verticesOrig : Vector3[];
private var skew : Vector3[];
private var skewAmount : float = 20.0;
private var lightDistance : float = 10;


/*
 *	Start()
 *
 *	Called as the object gets initialized.
 */
function Start () {

	// Find the GUI
	gui = GameObject.Find("GUI");
	
	// Store the value somewhere
	sliderValue = gui.GetComponent(GUIScript).shadowSlider;
	
	// Initialize GameObject properties
	objWidth = collider.bounds.size.z;
	objHeight = collider.bounds.size.y;
	objOriginX = collider.transform.position.x;
	objOriginY = collider.transform.position.y;
	objOriginZ = collider.transform.position.z;
	
	// Do some scaling
	heightScaleOffset = ((objHeight * scalingHeightVar) - objHeight) / 2;
	objWidth = objWidth * scalingWidthVar;
	objHeight = objHeight * scalingWidthVar;
	
	// Go
	ActivateShadow();
}

/*
 *	Update()
 *
 *	Called as the object updates in realtime.
 */
function Update () {
	VerifyShadow();		// Verify the shadow's location based on its parent object
	SkewShadow();		// Skew the shadow based on the player's locations
}

/*
 *	ActivateShadow()
 *
 *	Kicks off the shadow creation process by generating a Mesh
 *	for the shadow to reside on.
 */
function ActivateShadow() {

	//Debug.Log("Activating the shadow...");
	
	// Make a new shadow mesh
	shadowMesh = new Mesh();
	shadowMesh.name = "Shadow_Mesh_" + gameObject.name;

	// Define vertices
	var tempX : float = objOriginX;
	var tempY : float = objOriginY - (objWidth / 2);
	var tempZ : float = objOriginZ - (objHeight / 2);
	shadowMesh.vertices = [Vector3(tempX - objToWallDistance, tempY + heightScaleOffset, tempZ),
						   Vector3(tempX - objToWallDistance, tempY + heightScaleOffset, tempZ + objWidth),
						   Vector3(tempX - objToWallDistance, tempY + objHeight + heightScaleOffset, tempZ +objWidth),
						   Vector3(tempX - objToWallDistance, tempY + objHeight + heightScaleOffset, tempZ)];
						   
	// Define triangles
	if (reverseTriWinding) {
		shadowMesh.triangles = [2, 1, 0, 3, 2, 0];
	}
	else {
		shadowMesh.triangles = [0, 1, 2, 0, 2, 3];
	}
	
	shadowMesh.RecalculateNormals();	// Define normals
	shadowMesh.uv = [Vector2 (0, 0), Vector2 (0, 1), Vector2(1, 1), Vector2 (1, 0)];	// Define UVs
	
	// Create the shadow plane
	shadow = new GameObject("Shadow_Object_" + gameObject.name, MeshRenderer, MeshFilter, MeshCollider);
	shadow.GetComponent(MeshFilter).mesh = shadowMesh;
	shadow.renderer.material = shadowTexture;
}

/*
 *	VerifyShadow()
 *
 *	Redraws the shadow with a new position, if the parent object has been moved.
 */
function VerifyShadow() {

	var isInvalid : boolean = false;
	
	// If the position has changed, invalidate the shadow
	var newX : float = collider.transform.position.x;
	var newY : float = collider.transform.position.y;
	var newZ : float = collider.transform.position.z;
	if (!newX.Equals(objOriginX) || !newY.Equals(objOriginY) || !newZ.Equals(objOriginZ)) {
		
		// Respecify fields and invalidate
		objOriginX = newX;
		objOriginY = newY;
		objOriginZ = newZ;
		isInvalid = true;
	}
	
	// Reposition, if necessary
	if (isInvalid) {
		RepositionShadow();
	}
}

/*
 *	RepositionShadow()
 *
 *	
 */
function RepositionShadow() {

	//Debug.Log("Repositioning the shadow...");
	
	// Define vertices
	var tempX : float = objOriginX;
	var tempY : float = objOriginY - (objWidth / 2);
	var tempZ : float = objOriginZ - (objHeight / 2);
	shadowMesh.vertices = [Vector3(tempX - objToWallDistance, tempY + heightScaleOffset, tempZ),
						   Vector3(tempX - objToWallDistance, tempY + heightScaleOffset, tempZ + objWidth),
						   Vector3(tempX - objToWallDistance, tempY + objHeight + heightScaleOffset, tempZ +objWidth),
						   Vector3(tempX - objToWallDistance, tempY + objHeight + heightScaleOffset, tempZ)];
	
	SetSkewVertices();	// Set skew vertices based on new vertices
						   
	// Define triangles
	if (reverseTriWinding) {
		shadowMesh.triangles = [2, 1, 0, 3, 2, 0];
	}
	else {
		shadowMesh.triangles = [0, 1, 2, 0, 2, 3];
	}
	
	shadowMesh.RecalculateNormals();	// Define normals
	shadowMesh.uv = [Vector2 (0, 0), Vector2 (0, 1), Vector2(1, 1), Vector2 (1, 0)];	// Define UVs
	
	// Apply mesh
	shadow.GetComponent(MeshFilter).mesh = shadowMesh;
	shadow.renderer.material = shadowTexture;
}

/*
 *	SetSkewVertices()
 *
 *	Sets the vertices used for skewing
 */
function SetSkewVertices(){
	vertices = shadowMesh.vertices;
	verticesOrig = shadowMesh.vertices;
	if (skew == null) InitSkewVectors();
}

/*
 *	InitSkewVectors()
 *
 *	These vectors represent the skewing magnitudes
 */
function InitSkewVectors(){
	skew = shadowMesh.vertices;
	var count : int = 0;
	var root : int = Mathf.Sqrt(skew.length);	// this is currently designed for square planes
	for(var i : int = 0; i < root; i++){
		for(var j : int = 0; j < root; j++){
			var skw : float = i / skewAmount;
			skew[count++] = Vector3(0, 0, skw);
		}
	}
}

/*
 *	SkewShadow()
 *
 *	Skews the shadow in relation to the player's position 
 */
function SkewShadow(){
	
	// TODO : We will need to add an opacity fade-in to the shadow at lightDistance

	var dist : float = verticesOrig[0].z - player.position.z;
	for (var p : int = 0; p < vertices.length; p++){
		if(dist > (-1 * lightDistance) && dist < lightDistance){
			vertices[p] = Vector3(verticesOrig[p].x, verticesOrig[p].y, verticesOrig[p].z + skew[p].z * dist);
		}else{
			vertices[p] = Vector3(verticesOrig[p].x, verticesOrig[p].y, verticesOrig[p].z);
		}
	}
	shadowMesh.vertices = vertices;
}