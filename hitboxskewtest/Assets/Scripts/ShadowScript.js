#pragma strict


// The GUI
private var gui : GameObject;
private var sliderValue : float;

private var height : float;
private var width : float;

function Start () {

	// Find the GUI
	gui = GameObject.Find("GUI");
	
	// Store the value somewhere
	sliderValue = gui.GetComponent(GUIScript).shadowSlider;
}

function Update () {
	
	// 
	
}