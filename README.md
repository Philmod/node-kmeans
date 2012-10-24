# node-kmeans

  Node.js asynchronous implementation of the clustering algorithm k-means

![k-means](http://www.aishack.in/wp-content/uploads/2010/07/kmeans-example.jpg)

## Example

```js
// Data source: LinkedIn
var data = [ 
  {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
  {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
  {'company': 'Skype' , 'size': 700, 'revenue': 716},
  {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
  {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
  {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
];

// Create the data 2D-array (vectors) describing the data
var vectors = new Array();
for (var i = 0 ; i < data.length ; i++)
  vectors[i] = [ data[i]['size'] , data[i]['revenue']];

var kmeans = require('kmeans');
kmeans.clusterize(vectors, {k: 4}, function(err,res) {
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

## License 

(The MIT License)

Copyright (c) 2012 Philmod &lt;philippe.modard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.