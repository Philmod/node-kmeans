/**
 * Module dependencies.
 */

var kmeans = require('../')
  , should = require('should')
  , assert = require('assert')
  ;

/**
 * Data (expressly very separated)
 */
var data2D = [ 
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
var data3D = [ 
  [-10, 5, 100],
  [-11, 6, 101],
  [-10.5, 6.5, 102],
  [-9.5, 5.5, 103],
  [-9.75, 6.25, 104],

  [200, 12, -11],
  [205, 11.8, -10.8],
  [202, 11.5, -10],
  [208, 11, -12],
  [198, 11.15, -11],

  [40, -200, 568],
  [38, -190, 578],
  [39.5, -205, 556],
  [41, -200, 561],
  [40.25, -198, 562]  
];

/**
 * Tests
 */

/**/

describe('kmeans', function(){
  describe('#clusterize()', function(){
    
    it('should return an error if no data', function(done){
      kmeans.clusterize([], {k: 3}, function(err,res) {
        should.not.exist(res);
				should.exist(err);
        done(); 
      });
      /*kmeans.clusterize({k: 3}, function(err,res) {
        should.not.exist(res);
        should.exist(err);
      });*/
    });

    /*it('should return an error if no option', function(){
      kmeans.clusterize([], function(err,res) {
        should.not.exist(res);
				should.exist(err);
      });
    });*/

    /*it('should return a result (array)', function(){
      kmeans.clusterize(data3D, {k: 3}, function(err,res) {
        err.should.not.exist();
        res.should.have.length(3);
      });
    });*/

  });
});
