class Complex {

    constructor(real = 0,imag = 0, pol = false, precision = false) {
        this.real = real;
        this.imag = imag;
        this.isPolar = pol;
    }

    getReal() {
        return this.real;
    }

    getImag() {
        return this.imag;
    }

//  Die Argument-Funktion (Winkel) siehe Wikipedia Komplexe Zahlen    
    arg() {
        if (this.imag != 0.0 || this.real > 0.0) {
            return 2 * Math.atan2(this.imag, Math.sqrt(this.real*this.real + this.imag*this.imag) + this.real)
        }
        else if (this.imag == 0.0 && this.real < 0.0) {
            return Math.PI
        }
        else
            return 0.0
    }

    YX(betrag, phase) {
		console.log(betrag, phase)
        let rx = Math.log(betrag) * this.real - phase * this.imag;
        let ry = phase * this.real + Math.log(betrag) * this.imag;
        let realT = Math.pow(Math.E, rx) *  Math.cos(ry);
        if (Math.abs(Math.cos(ry)) < parseFloat(1E-15)) // cos(90) ist nicht Null !!
            realT = parseFloat(0);
        let imagT = Math.pow(Math.E, rx) * Math.sin(ry)
        if (Math.abs(Math.sin(ry)) < parseFloat(1E-15)) // sin(180) ist nicht Null !!
            imagT = parseFloat(0);
        return new Complex(realT, imagT, false)
    }
    
    Ln(betrag) {
        return new Complex(Math.log(betrag), this.arg(), false)
    }


    add(complexNumber) {
		console.log("add: ",complexNumber)
        return new Complex(this.real + complexNumber.real, this.imag + complexNumber.imag);
    }
    
    subtract(complexNumber) {
        return new Complex(this.real - complexNumber.real, this.imag - complexNumber.imag);
    }

    multiply(complexNumber) {
        return new Complex( this.real * complexNumber.real - this.imag * complexNumber.imag, this.real * complexNumber.imag + this.imag * complexNumber.real);
    }
    divNenner(num1, num2) {
        return num1*num1 + num2*num2
    }

    divide(complexNumber) {
        return new Complex((this.real * complexNumber.real + this.imag * complexNumber.imag)/this.divNenner(complexNumber.real, complexNumber.imag ), (this.imag * complexNumber.real - this.real * complexNumber.imag)/this.divNenner(complexNumber.real, complexNumber.imag ))
    }

    toString(precision = false){
//		console.log("this.imag: ", this.imag.toFixed(4))
//		console.log("this.real: ", this.real.toFixed(4))
		let numLen = parseFloat(4)
		if (precision) numLen = parseFloat(12)
		if (this.imag == 0)
			return this.real.toFixed(numLen);
		else {
			if (this.isPolar)
				return this.real.toFixed(numLen) + " \u2220" + this.imag.toFixed(numLen);
			else
				return this.real.toFixed(numLen) + " i" + this.imag.toFixed(numLen);
		}
    }

}
