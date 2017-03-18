function nextBigger(num) {
    function sortNum(num) {
        return num.toString().split('').sort().join('');
    }

    var sorted = sortNum(num);
    var revSorted = sorted.split('').reverse().join('');
    
    if (+revSorted === num) {
    	return num;
    }

    do {
        num++;
        var newSorted = sortNum(num);
    } while (newSorted !== sorted);

    return num;
}

console.log(nextBigger(21));
console.log(nextBigger(12));
console.log(nextBigger(513));
console.log(nextBigger(2017));
console.log(nextBigger(35741));
