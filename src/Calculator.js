'use strict';
 
var x = new Complex(parseFloat(0), parseFloat(0)); 
var y = new Complex(parseFloat(0), parseFloat(0)); 
var z = new Complex(parseFloat(0), parseFloat(0)); 
var t = new Complex(parseFloat(0), parseFloat(0)); 

var numOk = true;
var overrideFlag = false;	  
var pointSet = false;
var shiftStackUp = true;


function add_to_display(signToSet) {  
	console.log(x)
	if (numOk) {
		if (!overrideFlag) stackShift();
		showDisplayValues()
		numOk = false;
		overrideFlag = false
		if (signToSet === "E") {
			signToSet = "1E";
		}
		if (signToSet === ".") {
			signToSet = "0.";
		}

		x = signToSet;
	 }
	 else {
		if (window.document.Calculator.DisplayX.value.search("E") > 0 && (signToSet === "E" || signToSet === "."))
		{
			x = x;
		}
		else if (window.document.Calculator.DisplayX.value.search("\\.") > 0 && signToSet === ".")
		{
			x = x;
		}
		else
		{
			x = x + signToSet;
		}
	 }
	 window.document.Calculator.DisplayX.value = x;
}

	// Der Stack:
	// T
	// Z
	// Y
	// X

 function stackShift() 
 {
	 t = z;  
	 z = y;  
	 y = x; 
 }
 
 function stackDrop() {
		
	 y = z;
	 z = t;

}

 function enter() 
 {
	console.log("p2r: ", polar2rect(parseFloat(1), parseFloat(45)))
	checkDisplayInput(window.document.Calculator.DisplayX.value); 
	stackShift();
  
	overrideFlag = true;
	showDisplayValues();
 }

 function cplx() 
 {
	checkDisplayInput(window.document.Calculator.DisplayX.value);
	if (x.getImag() == 0.0 && y.getImag() == 0.0) {
		if (document.querySelector('input[name="RecPol"]:checked').value == "Rec")
			x = new Complex(parseFloat(y), parseFloat(x)); 
        else
            x = new Complex(parseFloat(y), parseFloat(x), true);
		stackDrop();
	}
	else if (x.getImag() != 0.0) {
		let bufferX = x;
		x = new Complex(parseFloat(x.getReal()), parseFloat(0));
		stackShift();
		x = new Complex(parseFloat(bufferX.getImag()), parseFloat(0));
		
	}
  
	overrideFlag = false;
	showDisplayValues();
 }

 function clearX() 
 {   

     x = new Complex(parseFloat(0), 0);
  
	 numOk = true;
	 overrideFlag = true;
	 showDisplayValues();
  
 }

 function showDisplayValues()
 {
	window.document.Calculator.DisplayX.value = x.toString();
	window.document.Calculator.DisplayY.value = y.toString();
}
 
 function checkDisplayInput(value)
 {
	 if (!numOk) {
		let expStr = new RegExp('\d+.?\d*E$')
		if (value.match(expStr)) {
			 value = value + "0";
		}
		
		try {
			x = new Complex (parseFloat(value), parseFloat(0));
		}
		catch(err) {
			window.document.Calculator.DisplayX.value = err;
		}
		numOk = true;
	}
 }
 function polar2rect(betrag, phi) {  // cmath.rect, WEGEN COS(90) NICHT NULL!
	 let conversionFactor = parseFloat(1);
	 if (document.querySelector('input[name="DegRad"]:checked').value == "Deg") conversionFactor = Math.PI/180; 
	
	 phi = phi * conversionFactor;
	
	 if (phi == Math.PI/2)
		return new Complex (parseFloat(0), parseFloat(betrag * Math.sin(phi)));
	 else if (phi == Math.PI)
		return new Complex (parseFloat(betrag * Math.cos(phi)), parseFloat(0));
	 else
		return new Complex (parseFloat(betrag * Math.cos(phi)), parseFloat(betrag * Math.sin(phi)));
 }

function calcRect() {
	
	x = polar2rect(x.getReal(), x.getImag());
	y = polar2rect(y.getReal(), y.getImag());
	z = polar2rect(z.getReal(), z.getImag());
	t = polar2rect(t.getReal(), t.getImag());
	showDisplayValues();
}

function betrag(complexNumber) {

	return Math.sqrt(complexNumber.getReal() * complexNumber.getReal() + complexNumber.getImag() * complexNumber.getImag());
}
	
function phase(complexNumber) {
	
	return Math.atan2(complexNumber.getImag(), complexNumber.getReal());
}

function calcPolar() {
	let conversionFactor = parseFloat(1);
	if (document.querySelector('input[name="DegRad"]:checked').value == "Deg") conversionFactor = 180/Math.PI; 
	
	if (x.getImag() != 0) x = new Complex(parseFloat(betrag(x)), parseFloat(phase(x) * conversionFactor), true);
	if (y.getImag() != 0) y = new Complex(parseFloat(betrag(y)), parseFloat(phase(y) * conversionFactor), true);
	if (z.getImag() != 0) z = new Complex(parseFloat(betrag(z)), parseFloat(phase(z) * conversionFactor), true);
	if (t.getImag() != 0) t = new Complex(parseFloat(betrag(t)), parseFloat(phase(t) * conversionFactor), true);
	showDisplayValues();
}

function checkResult(complexNumber) {
//	console.log("Number: ",  complexNumber.getReal());
	if (Number.isFinite(complexNumber.getReal())) return true
	else if (Number.isNaN(complexNumber.getReal())) return false
	else return false
}

function calculate(op) {
	checkDisplayInput(window.document.Calculator.DisplayX.value)
	let bufferX = x;
	if (document.querySelector('input[name="RecPol"]:checked').value == "Pol") calcRect();
	try {
		switch(op) {
			case "+":
				if (checkResult(y.add(x))) {
					x = y.add(x);
				}
				else throw "Number too big";
				break;
				console.log("RadioQ: ", document.querySelector('input[name="DegRad"]:checked').value); 
			case "-":
				if (checkResult(y.subtract(x))) {
					x = y.subtract(x);
				}
				else throw "Number too big";
				break;
			case "*":
				if (checkResult(y.multiply(x))) {
					x = y.multiply(x);
				}
				else throw "Number too big";
				break;
			case "/":
				console.log("x: ",x)
				console.log("y: ",y)
				if (checkResult(y.divide(x))) {
					x = y.divide(x)
				}
				else throw "Divide by zero";
				break;
			case "1/x":
				let one = new Complex(parseFloat(1), parseFloat(0));
				if (checkResult(one.divide(x))) {
					x = one.divide(x);
				}
				else throw "Divide by zero";
				break;
			case "x<>y":
				let bufX = x;
				x = y;
				y = bufX;
				break;
			case "y^x":
				console.log(x,y,x.YX(betrag(y), phase(y)),phase(y));
				if (checkResult(x.YX(betrag(y), phase(y)))) {
					x = x.YX(betrag(y), phase(y));
				}
				else throw "Number too big";
				break;
			case "sqrt":
				let pointHalf = new Complex(parseFloat(0.5), parseFloat(0));
				if (checkResult(pointHalf.YX(betrag(x), phase(x)))) {
					x = pointHalf.YX(betrag(x), phase(x));
				}
				else throw "Not a number";
				break;
			case "delX":
				x = new Complex (parseFloat(0), parseFloat(0));
				overrideFlag = true
				break;
		}
		if (document.querySelector('input[name="RecPol"]:checked').value == "Pol") calcPolar();
		if (['+','*','/','-','y^x'].includes(op)) stackDrop();
		numOk = true;
		overrideFlag = false; 
//		if (!x.getReal().isNaN && x.getReal().isFinite && !x.getImag().isNaN && x.getImag().isFinite)
		showDisplayValues();
	 }
	 catch(err) {
		 numOk = true;
		 console.log(err);
		 x = bufferX;
		 window.document.Calculator.DisplayY.value = err;
	 }

 }
 

 function plusMinus()    
 {
	 checkDisplayInput(window.document.Calculator.DisplayX.value)     
	 x = new Complex (parseFloat(x.getReal()*(-1)), parseFloat(x.getImag()*(-1)));	 
	 numOk = true;
	 showDisplayValues();
 } 
 
 
document.addEventListener("keypress", function(event) {
				
		switch(event.keyCode) {
			case 13:
				enter();
				break;
			case 48:
				add_to_display('0');
				break;
			case 49:
				add_to_display('1');
				break;
			case 50:
				add_to_display('2');
				break;
			case 51:
				add_to_display('3');
				break;
			case 52:
				add_to_display('4');
				break;
			case 53:
				add_to_display('5');
				break;
			case 54:
				add_to_display('6');
				break;
			case 55:
				add_to_display('7');
				break;
			case 56:
				add_to_display('8');
				break;
			case 57:
				add_to_display('9');
				break;
			case 46:
				add_to_display('.');
				break;
			case 43:calculate('+');
				break;
			case 42:
				calculate('*');
				break;
			case 45:
				calculate('-');
				break;
			case 47:
				calculate('/');
				break;
			case 114:
				calculate('sqrt');
				break;
			case 113:
				calculate('y^x');
				break;
			case 112:
				plusMinus();
				break;
			case 107:
				calculate('1/x');
				break;
			case 120:
				calculate('x<>y');
				break;
			case 99:
				calculate('delX');
				break;
			default:
				break;
		}
		
})		
