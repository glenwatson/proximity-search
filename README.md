# Proximity Search #

A JavaScript implementation of the nearest neighbours search problem for a given range on the Cartesian plane.

## Motivation ##
Rebuilding a kd-tree is inefficient when only a few elements have moved, or elements haven't moved very far.

## Useage ##
```JavaScript
//1. Gather your elements
var elements = [{id: <value>, x: <int>, y: <int>}, ...];

//2. Load the nns on elements
var nns = proximityNns(elements);

//3a. Define where you want to search
var searchLocation = {x: <searchX>, y: <searchY>};
var range = 10;

//3b. Get the elements near by
var nearElements = nns.search(searchLocation, range);

//...
//...update elements... (but not very much)
//...

//4. Call update() after updating x or y on elements, but before calling search()
nns.update();
```

## Implementation ##
1. Each dimension (x,y for now) is sorted and stored in an array.
* When searching, a binary search is performed on the upper and lower bounds (range) for each dimension.
* Each dimension is trimmed down to only the elements in that range and the intersection across all dimensions is returned
* Updates to the elements are made and the sorted arrays are resorted using insertion sort. Insertion sort was chosen because it performs very well on almost sorted lists.