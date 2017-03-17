function MyObject() {

}

MyObject.prototype = {
    simple: function (key, value) {
        Object.defineProperty(this, key, {
            value: value,
            configurable: true,
            writable: true,
            enumerable: true
        });
    },

    constant: function (key, value) {
        Object.defineProperty(this, key, {
            value: value,
            configurable: false,
            writable: false,
            enumerable: true
        });
    },

    hidden: function (key, value) {
        Object.defineProperty(this, key, {
            value: value,
            enumerable: false
        });
    },

    values: function () {
        var self = this;

        return Object.keys(this).map(function (key) {
            return self[key];
        })
    }
};

var obj = new MyObject();

obj.simple('test', 123);
obj.constant('test1', 234);
obj.hidden('test2', 345);
console.log(obj.values());