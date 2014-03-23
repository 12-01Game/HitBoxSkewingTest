#pragma strict

var dt : float;
var jumpForce : float;
var jumpDelay : float;

var canJump : boolean;
var timeSinceLastJump : float;

var movement : LateralMovement;

function Start () {
	dt = Time.deltaTime;
	
	jumpForce = 6;
	jumpDelay = 1.5;
	
	canJump = true;
	timeSinceLastJump = 10;
	
	movement = this.GetComponent(LateralMovement);
}

function Update () {
	timeSinceLastJump += dt;
	
	if (timeSinceLastJump > jumpDelay) {
		canJump = true;
	}
	
	if (canJump && Input.GetKeyDown("space")) {
		rigidbody.velocity.y += jumpForce;
		
		canJump = false;
		timeSinceLastJump = 0;
	}
}