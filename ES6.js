let ClassTwo = Base => class extends Base {
    // ClassTwo Code
};
class Example extends classTwo(ClassOne) {
    constructor() {
    }
}
OR
var mixin = require('mixin');
class Cyclist {
    ride() {
        console.log(`${this.name} is riding`);
    }
}
class Swimmer {
    swim() {
        console.log(`${this.name} is swimming`);
    }
}
class Runner {
    run() {
        console.log(`${this.name} is running`);
    }
}
class Triathlete extends mixin(mixin(Cyclist, Swimmer), Runner) {
    constructor(name) {
        this.name = name;
    }

    letsDoIt() {
        this.ride();
        this.swim();
        this.run();
    }
}
let bob = new Triathlete('Bob');
bob.letsDoIt();

//---------------------------------

var CalendarPlanAssign = function () {
    this.registerEvents = function () {
        this.clickDayCalendarMini();
        this.changeSelectOptionPullDown();
        this.calendarPlanAssignUpdate();
        this.calendarPlanAssignSave();
    };
};

CalendarPlanAssign.prototype.clickDayCalendarMini = function () {
}

Var calendarPlanAssign  = new CalendarPlanAssign ();
Var = calendarPlanAssign.clickDayCalendarMini();

// -----------------------------------------------

function three_dot2 (a, b, ...args) {
    console.log(args.length); // in ra "2"
    console.log(args); // in ra "3 4"
}
three_dot2(1, 2, 3, 4);

//----------------------------------------------

console.log(`content of line1 is: ${line1}`);

// --------------------Arrow function:-------------------------
var hello = (name, message) => {
    console.log("Chào " + name + ", b?n là " + message);
};

// ------------------------------------------------
var domain = ["freetuts.net", 'qa.freetuts.net', 'demo.freetuts.net'];
domain.map((val, key) => {
    // Luu l?i
    domain[key] = val.toUpperCase();
});

// --------------------------ES5------------------------

var blog = {
    domain : "freetuts.net",
    showWebsite : function (callbackFunction){
        callbackFunction();
    },
    render : function(){
        this.showWebsite(function (){
            console.log(this.domain); // this chính là blog
        }.bind(this)); // ph?i s? d?ng hàm bind thì d?i tu?ng this m?i chính là blog
    }
};

blog.render();

// -----------------------------ES6--------------------------------

var blog = {
    domain : "freetuts.net",
    showWebsite : function (callbackFunction){
        if(typeof callbackFunction === "function")
            callbackFunction();
    },
    render : function(){
        this.showWebsite((() => {
            console.log(this.domain); // this chính là blog
        }));
    }
};

blog.render();

//-------------------------------------------
// Array
let date = [10, 103, 2016]

// Chuy?n ba giá tr? vào ba bi?n y
let [, , y] = date;

// In k?t qu?
console.log("Year: " + y);

//--------------------------------------------------

var domains = [
    'freetuts.net',
    'google.com',
    'facebook.com'
];

for (domain of domains){
    const message = "Domain " + domain;
    console.log(message);
}

//-----------------------1D Array----------------------------
Kh?i t?o: let set = new Set([1, 2, 3, 4]);
Thêm ph?n t?: set.add(5); // numbers = Set {1, 2, 3, 4 ,5}
Xóa ph?n t?: set.delete(2);// numbers = Set {1, 3, 4 ,5}
Ki?m tra t?n t?i giá tr?: set.has(8); // false
Ð?m t?ng s? ph?n t?: set.size; console.log(set.size); // 4
Xóa toàn b? ph?n t?: set.clear(); // numbers = Set()

//------------------------use map----------------------------
let set = new Set([1, 2, 3]);
let arr = [...set].map(function(x){
    return x * 2;
});

console.log(set); // Set(1, 2, 3)
console.log(arr); // [2, 4, 6]

//---------------------------------filter------------------------------
let set = new Set([1, 2, 3]);

// L?y các s? ch?n
let arr = [...set].filter(function(x){
    return (x % 2) == 0;
});

console.log(set); // Set(1, 2, 3)
console.log(arr); // [2]

// ---------------------------Map-----------------------------------------

//--- Kh?i t?o: T?o m?t map g?m 3 thông tin
let map = new Map([
    ["Name", "Nguyen Van Cuong"],
    ["Email", "thehalfheart@gmail.com"],
    ["Website", "freetuts.net"]
]);

console.log(map);
// Map {"Name" => "Nguyen Van Cuong", "Email" => "thehalfheart@gmail.com", "Website" => "freetuts.net"}

//--- Thêm ph?n t?:
let map = new Map();
map.set('Name', 'Nguyen Van Cuong');
console.log(map);
// Map {"Name" => "Nguyen Van Cuong"}

//---- X? lý Hàm entries() - l?y danh sách keys + values
for (var entry of map.entries())
{
    console.log(entry[0] + ' - ' + entry[1]);
}

// K?t qu?
// name - Nguyen Van Cuong
// domain - freetuts.net

//-------------------------Promise------------------------

var promise = new Promise(function(resolve, reject){
    resolve('Success');
    // OR
    reject('Error');
});

promise
    .then(
        function(message){
            console.log(message);
        },
        function(error){
            console.log(error);
        })
    .catch(function(message){
        console.log(message);
    });

//KQ : Success
//Trong dó:
//resolve là m?t hàm callback x? lý cho hành d?ng thành công.
//reject là m?t hàm callback x? lý cho hành d?ng th?t b?i.

// ----------------------------Class -----------------------

'use strict'
class Polygon {
    constructor(height, width) {
        this.h = height;
        this.w = width;
    }
    test() {
        console.log("The height of the polygon: ", this.h)
        console.log("The width of the polygon: ",this. w)
    }
}

//creating an instance
var polyObj = new Polygon(10,20);
polyObj.test();


//*****************************************

'use strict'
class Shape {
    constructor(a) {
        this.Area = a
    }
}
class Circle extends Shape {
    disp() {
        console.log("Area of the circle:  "+this.Area)
    }
}

var obj = new Circle(223);
obj.disp()

////////////////////////////////////////////////////////////
var {name, stage_name, age, home_town} = singer
/// ------------------ =>
var name = singer.name
var stage_name = singer.stage_name
var age = singer.age
var home_town = singer.home_town
////////////////////////////////////////////////////////////

// chua the dung dung async await do chua hieu
// can phai cai goi
        // 1. => npm install babel-cli
        // 2. start qua babel-cli
            // start: babel-node index.js
            // VD: "start": "supervisor babel-node ./", (supervisor la auto run, ..)
        // 3. npm install babel-preset-es2015 babel-preset-es2017 --save
        // 4. touch .babelrc (cau hinh
        //         {
        //             "presets": ["es2015", "es2017", (goi da cai dat)]
        //         }


//////////////////// xy ly bat dong bo /////////////////////
function getUrlsValue(urls) {

    var promiseArr = [];
    this.value = [];
    var self = this;

    urls.forEach(function (url) {
        promiseArr.push(
            new Promise(function (resolve, reject) {
                if (url) {
                    resolve(url.value);
                } else {
                    reject("error");
                }
            }).then(function (urlVal) {
                return self.value.push(urlVal);
            })
        );
    });
    return Promise.all(promiseArr).then(function () {
        return self.value;
    });
}

var urls = [{ _id: 1, value: 1}, {_id: 2, value: 2}, {_id: 3, value: 3}]
var values = getUrlsValue(urls);

var sum = 0;
values.then(function (valArr) {
    valArr.forEach(function (val) {
        sum += val;
    })
})

///////////////////transaction bookshelf nodejs/////////////////////////////


function insertUser(user, cb) {
    return bookshelf.transaction(function (t) {
        var key = user.key;

        var devID = Developer.forge({key: key})
            .fetch({require: true, transacting: t})
            .call("get", "id");

        var addressID = devID.then(function () {
            return Address.forge(user.address).fetch({require: true, transacting: t})
        }).call("get", "addressId");

        var financialID = addressModel.then(function () {
            return Financial.forge(user.financial).save(null, {transacting: t})
        }).call("get", "financialId");

        var userModel = financialID.then(function () {
            var userEntity = user.personal;
            userEntity.addressId = addressID.value();
            userEntity.developerId = devID.value();
            userEntity.financialId = financialID.value();
            return User.forge(userEntity).save(null, {transacting: t});
        });

        return userModel.then(function (userModel) {
            logger.info('saved user: ', userModel);
            logger.info('commiting transaction');
            t.commit(userModel);
        }).catch(function (e) {
            t.rollback(e);
            throw e;
        });
    }).then(function (model) {
        logger.info(model, ' successfully saved');
        return Promise.resolve(respond.success({userId: model.get('userId')}));
    }).catch(function (err) {
        logger.error(err, ' occurred');
        return Promise.reject(new DatabaseError('Unable to write user to database due to error ', err.message));
    });
};
