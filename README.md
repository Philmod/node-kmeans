# node-kmeans

  Node.js asynchronous implementation of the clustering algorithm k-means

![k-means](http://www.aishack.in/static/img/tut/kmeans-example.jpg)

## Installation

      $ npm install node-kmeans

## Example

```js
// Data source: LinkedIn
const data = [
  {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
  {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
  {'company': 'Skype' , 'size': 700, 'revenue': 716},
  {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
  {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
  {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
];

// Create the data 2D-array (vectors) describing the data
let vectors = new Array();
for (let i = 0 ; i < data.length ; i++) {
  vectors[i] = [ data[i]['size'] , data[i]['revenue']];
}

const kmeans = require('node-kmeans');
kmeans.clusterize(vectors, {k: 4}, (err,res) => {
  if (err) console.error(err);
  else console.log('%o',res);
});
```
## Intputs
 - 'vectors' is a nXm array (n [lines] : number of points, m [columns] : number of dimensions)
 - options object:
    - k : number of clusters

## Outputs
An array of objects (one for each cluster) with the following properties:
 - centroid : array of X elements (X = number of dimensions)
 - cluster : array of X elements containing the vectors of the input data
 - clusterInd : array of X integers which are the indexes of the input data

## To do
 - Technique to avoid local optima (mutation, ...)

## Author

Philmod &lt;philippe.modard@gmail.com&gt;
