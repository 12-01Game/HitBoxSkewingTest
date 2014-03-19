#pragma strict

var shadowSlider : float;

function Start () {
	// Nothing to do...
}

function Update () {
	// Nothing to do...
}

function OnGUI () {
	// Get the value of the shadow slider
	shadowSlider = GUI.HorizontalSlider(Rect(25, 25, 200, 30), shadowSlider, 0, 1);
}