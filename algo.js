function proximityNns(elements) {
	var sortedX, //Array sorted on .x
		sortedY; //Array sorted on .y
	/*
	 * binary search that rounds fraction-indexes up
	 * e.g. - binarySearchRoundUp([0,2], 1) === 1
	 */
	function binarySearchRoundUp(arr, val, cmp) {
		var low = 0, high = arr.length;
		var mid = -1, c = 0;
		while(low < high)	{
			mid = ~~((low + high)/2); //Math.floor()
			c = cmp(arr[mid], val);
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
	};
	/*
	 * binary search that rounds fraction-indexes down
	 * e.g. - binarySearchRoundDown([0,2], 1) === 0
	 */
	function binarySearchRoundDown(arr, val, cmp) {
		var low = -1, high = arr.length-1;
		var mid = -1, c = 0;
		while(low < high)	{
			mid = Math.ceil((low + high)/2);
			c = cmp(arr[mid], val);
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
	};
	
	/*
	 * Insertion sort on an array
	 * Used since it is fast on almost sorted arrays
	 */
	function insertionSort(arr, cmp) {
		var len = arr.length, 
			i = -1, 
			j, 
			tmp;
		
		while (len--) {
			tmp = arr[++i];
			j = i;
			while (j-- && cmp(arr[j], tmp) > 0) {
				arr[j + 1] = arr[j];
			}
			arr[j + 1] = tmp;
		}
	};
	
	/*
	 * Returns a function that compares the passed in property
	 */
	function compareProp(prop) {
		return function(a, b) { return a[prop] - b[prop] };
	}
	
	/*
	 * Called with the initial elements to be sorted
	 * @param elements (array) - the elements in the search space. In the form {id: ?, x: ?, y: ?}
	 */
	function init(elements) {
		sortedX = elements
			.map(function(x){ return x; }) //copy the array
			.sort(compareProp('x')); //sort on x
		sortedY = elements
			.map(function(x){ return x; }) //copy the array
			.sort(compareProp('y')); //sort on y
	}
	
	/*
	 * Called after any element that was passed to init() has been updated
	 */
	function update() {
		insertionSort(sortedX, compareProp('x')); //almost sorted
		insertionSort(sortedY, compareProp('y')); //almost sorted
	}
	
	/*
	 * Searches the elements
	 * @param needle (object) - the point to search from. In the form {x: ?, y: ?}
	 * @param range (int) - the distance from needle to search
	 */
	function search(needle, range) {
		//get the lowest X value inside the range
		var lowIdxX = binarySearchRoundUp(sortedX, {x:needle.x - range}, compareProp('x'));
		//get the highest X value inside the range
		var highIdxX = binarySearchRoundDown(sortedX, {x:needle.x + range}, compareProp('x'));
		//get the lowest Y value inside the range
		var lowIdxY = binarySearchRoundUp(sortedY, {y:needle.y - range}, compareProp('y'));
		//get the highest Y value inside the range
		var highIdxY = binarySearchRoundDown(sortedY, {y:needle.y + range}, compareProp('y'));
		
		//intersect the arrays
		/*
		// optimization: hash the smaller set
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


//WIP begin
	function closestKTo(arr, k, needle, cmp) {
			var closest = [], 
				len = arr.length,
				high, low,
				highDist, lowDist;
			high = binarySearchRoundUp(arr, needle, cmp);
			low = high - 1;
			if (high < len) {
				highDist = cmp(arr[high], needle);
			} else {
				highDist = Infinity;
			}
			if (low >= 0) {
				lowDist = cmp(needle, arr[low]);
			} else {
				lowDist = Infinity;
			}
			while (closest.length < k && (low >= 0 || high < len)) {
				if (highDist < lowDist) {
					closest.push(arr[high]);
					high++;
					if (high < len) {
						highDist = cmp(arr[high], needle);
					} else {
						highDist = Infinity;
					}
				} else {
					closest.push(arr[low]);
					low--;
					if (low >= 0) {
						lowDist = cmp(needle, arr[low]);
					} else {
						lowDist = Infinity;
					}
				}
			}
			return closest;
		};
//tests
		function arraysEqual(a, b) {
			if (a === b) return true;
			if (a == null || b == null) return false;
			if (a.length != b.length) return false;

			a.sort();
			b.sort();

			for (var i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		}
		function assertArraysEqual(a, b, msg) {
			console.assert(arraysEqual(a, b), "'"+msg+"'  Expected ["+b+"] Actual ["+a+"]");
		}
		function testDist(a,b) { return a-b };
		
		;(function () {
			assertArraysEqual(closestKTo([], 0, 0, testDist), [], "empty array");
			assertArraysEqual(closestKTo([], 1, 55, testDist), [], "empty array");
			assertArraysEqual(closestKTo([], 100, 55, testDist), [], "empty array");

			assertArraysEqual(closestKTo([], -1, -1, testDist), [], "empty array");
			assertArraysEqual(closestKTo([1], -1, -1, testDist), [], "bad input");
			assertArraysEqual(closestKTo([1,2], -1, -1, testDist), [], "bad input");
			assertArraysEqual(closestKTo([1,3,4,6], -1, -1, testDist), [], "bad input");

			assertArraysEqual(closestKTo([], 0, 3, testDist), [], "k=0");
			assertArraysEqual(closestKTo([1], 0, 3, testDist), [], "k=0");
			assertArraysEqual(closestKTo([1,3], 0, 3, testDist), [], "k=0");
			assertArraysEqual(closestKTo([1,3,4,6], 0, 3, testDist), [], "k=0");

			assertArraysEqual(closestKTo([1], 1, 1, testDist), [1], "one and only one");
			assertArraysEqual(closestKTo([1], 1, 0, testDist), [1], "one and only one");
			assertArraysEqual(closestKTo([1], 1, 100, testDist), [1], "one and only one");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 3, testDist), [3], "Exact match");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 1, testDist), [1], "Exact match at beginng");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 4, testDist), [4], "Exact match");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 6, testDist), [6], "Exact match at end");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 2, testDist), [1], "Right in the middle");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 5, testDist), [4], "Right in the middle");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 0, testDist), [1], "Before first element");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 100, testDist), [6], "After last element");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 1.9, testDist), [1], "Should round down");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 2.1, testDist), [3], "Should round up");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 4.9, testDist), [4], "Should round down");
			assertArraysEqual(closestKTo([1,3,4,6], 1, 5.1, testDist), [6], "Should round up");
			assertArraysEqual(closestKTo([1,3,4,6], 1, -1, testDist), [1], "Negative search");
			
			assertArraysEqual(closestKTo([1,3,4,6], 2, 2, testDist), [1,3], "Right in the middle, return 2");
			assertArraysEqual(closestKTo([1,3,4,6], 2, 3, testDist), [3,4], "Exact match, return 2");
			assertArraysEqual(closestKTo([1,3,4,6], 2, 0, testDist), [1,3], "Before first element, return 2");
			assertArraysEqual(closestKTo([1,3,4,6], 2, 100, testDist), [4,6], "After last element, return 2");
			
			assertArraysEqual(closestKTo([1,3,4,6], 3, 100, testDist), [3,4,6], "After last element, return 3");
			assertArraysEqual(closestKTo([1,3,4,6], 3, 0, testDist), [1,3,4], "Before first element, return 3");
			assertArraysEqual(closestKTo([1,3,4,6], 3, 3, testDist), [1,3,4], "Exact match, return 3");
			assertArraysEqual(closestKTo([2,3,4], 3, 3, testDist), [2,3,4], "Exact match in middle, return 3");
			assertArraysEqual(closestKTo([1,2,3,4,5], 3, 3, testDist), [2,3,4], "Exact match in middle, return 3");
			
			assertArraysEqual(closestKTo([1,3,4,6], 4, 100, testDist), [1,3,4,6], "After last element, return all");
			assertArraysEqual(closestKTo([1,3,4,6], 4, 0, testDist), [1,3,4,6], "Before first element, return all");
			assertArraysEqual(closestKTo([1,3,4,6], 4, 3, testDist), [1,3,4,6], "Exact match, return all");
			
			assertArraysEqual(closestKTo([1,3,4,6], 100, 0, testDist), [1,3,4,6], "After last element, return more than array");
			assertArraysEqual(closestKTo([1,3,4,6], 100, 100, testDist), [1,3,4,6], "Before first element, returnmore than array");
			assertArraysEqual(closestKTo([1,3,4,6], 100, 3, testDist), [1,3,4,6], "Exact match, return more than array");
		})();
	
//WIP end
	
	init(elements);
	
	return {
		search: search,
		update: update,
		closestKTo: closestKTo,
	};
}
