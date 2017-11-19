class Shape {
    constructor(a) {
        this.Area = a
    }
}
class Circle extends Shape {
    disp() {
        console.log("Area of the circle:  " + this.Area)
    }
}

var obj = new Circle(223);
obj.disp();

'use strict';
class Polygon {
    constructor(height, width) {
        this.h = height;
        this.w = width;
    }

    test() {
        console.log("The height of the polygon: ", this.h);
        console.log("The width of the polygon: ", this.w)
    }
}

//creating an instance
var polyObj = new Polygon(10, 20);
polyObj.test();

var domain = ["freetuts.net", 'qa.freetuts.net', 'demo.freetuts.net'];
domain.map((val, key) => {
    // Lưu lại
    domain[key] = val.toUpperCase();
});

console.log(domain);

var fs = require('fs');
var content = fs.readFileSync(__dirname + '/../xl.xlsx');

console.log(content);