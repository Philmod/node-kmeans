/**
 * Module dependencies.
 */

var kmeans = require('../')
  , should = require('should')
  ;

/**
 * Data (expressly very separated)
 */
var data = [ 
  [-10, 5],
  [-11, 6],
  [-10.5, 6.5],
  [-9.5, 5.5],
  [-9.75, 6.25],

  [200,12],
  [205,11.8],
  [202,11.5],
  [208,11],
  [198,11.15],

  [40,-200],
  [38,-190],
  [39.5,-205],
  [41,-200],
  [40.25,-198]  
];

new kmeans.clusterize(data, {k: 3}, function(err,res) {
	if (err) console.error(err);
	else console.log('%o',res);
});