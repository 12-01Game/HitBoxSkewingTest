#pragma strict

var moveSpeed : float;
var dt : float;
var forward : Vector3;

function Start () {
	moveSpeed = 3.0;
	dt = Time.deltaTime;
	forward = transform.TransformDirection(Vector3.right);
}

function Update () {
	
	if (Input.GetAxis("Horizontal")) {
		transform.Translate(moveSpeed * dt * forward * Input.GetAxis("Horizontal"));
	}
}