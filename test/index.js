/**
 * Module dependencies.
 */

var kmeans = require('../')
  , should = require('should')
  ;

/**
 * Data source: LinkedIn.
 */
var data = [ 
  {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
  {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
  {'company': 'Skype' , 'size': 700, 'revenue': 716},
  {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
  {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
  {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
];

// Create the labels and the vectors describing the data
var labels = new Array();
var vectors = new Array();
for (var i = 0 ; i < data.length ; i++) {
    labels[i] = data[i]['company'] ;
    vectors[i] = [ data[i]['size'] , data[i]['revenue']] ;
};


new kmeans.clusterize(vectors, {k: 4}, function(err,res) {
	if (err) console.error(err);
	else console.log('%o',res);
});