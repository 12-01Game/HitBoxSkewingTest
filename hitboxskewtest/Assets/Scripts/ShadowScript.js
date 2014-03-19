#pragma strict


// The GUI
private var gui : GameObject;
private var sliderValue : float;

private var height : float;
private var width : float;
private var originX : float;
private var originY : float;
private var originZ : float;

private var mf : MeshFilter;
private var vertices : Vector3[];
private var mesh : Mesh;

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
	
	// Get the mesh filter component and set it
	var mf: MeshFilter = GetComponent(MeshFilter);
	mesh = new Mesh();
	mf.mesh = mesh;
	
	// Get the collider
	var collider : BoxCollider = GetComponent(BoxCollider);
	
	// Initialize the variables
	
	// TODO: Setting the origin x, y, and z should be done in the Update() method
	// to allow for objects that can be moved!!
	vertices = new Vector3[4];
	width = collider.bounds.size.z;
	height = collider.bounds.size.y;
	originX = collider.transform.position.x;
	originY = collider.transform.position.y;
	originZ = collider.transform.position.z;
	
	renderer.material.SetTexture();
}

/*
 *	Update()
 *
 *	Called as the object updates in realtime.
 */
function Update () {

	var startX = originX - (originX / 2) - 10;
	var startY = originY - (originY / 2);
	var startZ = originZ - (originZ / 2);
	
	// Set vertices
	vertices[0] = new Vector3(startX, startY, startZ);
	vertices[1] = new Vector3(startX, startY, startZ + width);
	vertices[2] = new Vector3(startX, startY + height, startZ + width);
	vertices[3] = new Vector3(startX, startY + height, startZ);
	
	mesh.vertices = vertices;
	
	// Code from website
	var tri: int[] = new int[6];

	tri[0] = 0;
	tri[1] = 2;
	tri[2] = 1;

	tri[3] = 2;
	tri[4] = 3;
	tri[5] = 1;

	mesh.triangles = tri;
}