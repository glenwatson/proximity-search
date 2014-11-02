//binary search
/*
 * binary search that rounds fraction-indexes up
 * e.g. - [0,2].binarySearchUpper(1) === 1
 */
Array.prototype.binarySearchUpper = function(val, cmp) {
	var low = 0, high = this.length;
	var mid = -1, c = 0;
	while(low < high)	{
		mid = ~~((low + high)/2); //Math.floor()
		c = cmp(this[mid], val);
		if(c < 0)	{
			low = mid + 1;
		} else if(c > 0) {
			high = mid;
		} else {
			return mid;
		}
		//console.log("mid=" + mid + ", c=" + c + ", low=" + low + ", high=" + high);
	}
	return low;
}
/*
 * binary search that rounds fraction-indexes down
 * e.g. - [0,2].binarySearchUpper(1) === 0
 */
Array.prototype.binarySearchLower = function(val, cmp) {
	var low = -1, high = this.length-1;
	var mid = -1, c = 0;
	while(low < high)	{
		mid = Math.ceil((low + high)/2);
		c = cmp(this[mid], val);
		if(c < 0)	{
			low = mid;
		} else if(c > 0) {
			high = mid - 1;
		} else {
			return mid;
		}
		//console.log("mid=" + mid + ", c=" + c + ", low=" + low + ", high=" + high);
	}
	return low;
}


var elements = [];
for (var i=0; i<100; i++) {
	elements.push({id: i, x:Math.floor(Math.random() * 100), y:Math.floor(Math.random() * 100)});
}

function compareProp(prop) {
	return function(a, b) { return a[prop] - b[prop] };
}
function get(prop) {
	return function(x) {return x[prop];};
}

var sortedX = elements.map(function(x){ return x; }).sort(compareProp('x'));
var sortedY = elements.map(function(x){ return x; }).sort(compareProp('y'));

function update() {
	sortedX = elements.sort(compareProp('x')); //almost sorted
	sortedY = elements.sort(compareProp('y')); //almost sorted
}

function search(needle, range) {
	var lowIdxX = sortedX.binarySearchUpper({x:needle.x - range}, compareProp('x'));
	var highIdxX = sortedX.binarySearchLower({x:needle.x + range}, compareProp('x'));
	
	var lowIdxY = sortedY.binarySearchUpper({y:needle.y - range}, compareProp('y'));
	var highIdxY = sortedY.binarySearchLower({y:needle.y + range}, compareProp('y'));
	
	//hash the smaller set
	/*
	if (resultsX.length < resultsY.length) {
		var smallerResults = resultsX;
		var largerResults = resultsY;
	} else {
		var largerResults = resultsX;
		var smallerResults = resultsY;
	}
	*/
	//construct hash
	var smallestResultHash = {};
	var i = lowIdxX;
	while (i <= highIdxX) {
		smallestResultHash[sortedX[i].id] = true;
		i++;
	}
	//return the intersection
	var intersection = [];
	i = lowIdxY;
	while (i <= highIdxY) {
		if (smallestResultHash[sortedY[i].id]) {
			intersection.push(sortedY[i]);
		}
		i++;
	}
	return intersection;
}