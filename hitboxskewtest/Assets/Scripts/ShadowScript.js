/*
 *	ShadowScript.js
 *
 *	Version 0.0
 *	(C)2014 Jonathan Ballands, All Rights Reserved.
 *
 *	Written for the 12:01 video game for CS 4644
 */

#pragma strict

/*
 *	Fields
 */
 
var objToWallDistance : float;		// Store how far away the GameObject's edge is from the wall

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

// TODO: Have some boolean variables (eg, isMiddle)

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
	
	// Go
	ActivateShadow();
}

/*
 *	Update()
 *
 *	Called as the object updates in realtime.
 */
function Update () {

	// TODO: Make the shadow move
	
}

/*
 *	ActivateShadow()
 *
 *	Kicks off the shadow creation process by generating a Mesh
 *	for the shadow to reside on.
 */
function ActivateShadow() {

	// Null check
	if (shadowMesh != null) {
		Debug.LogError("The shadow has already be activated for this GameObject");
		return;
	}
	
	// Make a new shadow mesh
	shadowMesh = new Mesh();
	shadowMesh.name = "Shadow_Mesh_" + gameObject.name;

	// Define vertices
	shadowMesh.vertices = [Vector3(objOriginX + objToWallDistance, objOriginY, objOriginZ),
						   Vector3(objOriginX + objToWallDistance, objOriginY, objOriginZ + objWidth),
						   Vector3(objOriginX + objToWallDistance, objOriginY + objHeight, objOriginZ +objWidth),
						   Vector3(objOriginX + objToWallDistance, objOriginY + objHeight, objOriginZ)];
						   
	// Define triangles
	shadowMesh.triangles = [0, 1, 2, 0, 2, 3];
	
	// Define UVs
	shadowMesh.uv = [Vector2 (0, 0), Vector2 (0, 1), Vector2(1, 1), Vector2 (1, 0)];
	
	// Define normals
	shadowMesh.RecalculateNormals();
	
	// Create the shadow plane
	var shadowObj : GameObject = new GameObject("Shadow_Object_" + gameObject.name, MeshRenderer, MeshFilter, MeshCollider);
	shadowObj.GetComponent(MeshFilter).mesh = shadowMesh;
}
