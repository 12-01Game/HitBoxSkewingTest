/*
 *	ShadowScript.js
 *
 *	Version 1.0
 *	Coded with <3 by Jonathan Ballands
 *
 *	Written for the 12:01 video game for CS 4644
 */

#pragma strict

/*
 *	Fields
 */
 
var objToWallDistance : float;		// Stores how far away the GameObject's back edge is from the wall
var scalingWidthVar : float;		// Stores how the shadow should scale in size with respect to the size of the GameObject
var scalingHeightVar : float;		// Stores how the shadow should scale in size with respect to the size of the GameObject
var shadowTexture : Material;		// Stores the texture for the shadow
var reverseTriWinding : boolean;	// This prevents the "backfacing" problem

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
	
	// Just verify the shadow
	VerifyShadow();
}

/*
 *	ActivateShadow()
 *
 *	Kicks off the shadow creation process by generating a Mesh
 *	for the shadow to reside on.
 */
function ActivateShadow() {

	Debug.Log("Activating the shadow...");
	
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
	
	// Define normals
	shadowMesh.RecalculateNormals();
	
	// Define UVs
	shadowMesh.uv = [Vector2 (0, 0), Vector2 (0, 1), Vector2(1, 1), Vector2 (1, 0)];
	
	// Create the shadow plane
	shadow = new GameObject("Shadow_Object_" + gameObject.name, MeshRenderer, MeshFilter, MeshCollider);
	shadow.GetComponent(MeshFilter).mesh = shadowMesh;
	shadow.renderer.material = shadowTexture;
}

/*
 *	VerifyShadow()
 *
 *	Redraws the shadow with a new skew and position, if necessary.
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
	
	// TODO: If the skew needs to be changed, invalidate the shadow.
	
	// Redraw, if necessary 
	if (isInvalid) {
		RedrawShadow();
	}
	
}

/*
 *	RedrawShadow()
 *
 *	
 */
function RedrawShadow() {

	Debug.Log("Redrawing the shadow...");
	
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
	
	// Define normals
	shadowMesh.RecalculateNormals();
	
	// Define UVs
	shadowMesh.uv = [Vector2 (0, 0), Vector2 (0, 1), Vector2(1, 1), Vector2 (1, 0)];
	
	// Apply mesh
	shadow.GetComponent(MeshFilter).mesh = shadowMesh;
	shadow.renderer.material = shadowTexture;
}
