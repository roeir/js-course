function map(fn, arr) {
    function iterator(result, index) {

        if(index < arr.length) {
            var value = fn(arr[index], index, arr);
            result.push(value);
            return iterator(result, index + 1);
        } else {
            return result;
        }
    }

    return iterator([], 0);
}

var arr = [1, 2, 3, 4, 5];
var result = map(function (item, index, arr) {
    return item + index;
}, arr);

console.log('arr: ', arr);
console.log('result: ', result);