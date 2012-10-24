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

 var test = function(a) { throw new Error('fail'); };

/**/

describe('kmeans', function(){
  describe('#clusterize() errors', function(){

    it('should throw an error if there aren\'t 3 arguments', function(){
      (function() {
        kmeans.clusterize();
      }).should.throw('Provide 3 arguments: vector, options, callback');
      (function() {
        kmeans.clusterize({});
      }).should.throw('Provide 3 arguments: vector, options, callback');
      (function() {
        kmeans.clusterize({},{});
      }).should.throw('Provide 3 arguments: vector, options, callback');
    });

    it('should throw an error if no callback function', function(){
      (function() {
        kmeans.clusterize([], {}, {});
      }).should.throw('Provide a callback function');
    });

    it('should throw an error if no \'k\' option', function(){
      (function() {
        kmeans.clusterize([], {}, function(err,res) {});
      }).should.throw('Provide an array of data');
    });
    
    it('should return an error if the data vector is not an array', function(done){
      kmeans.clusterize({}, {k: 3}, function(err,res) {
        should.not.exist(res);
				err.should.equal('Provide an array of data');
        done(); 
      });
    });

    it('should return an error if the number of points is smaller than the number k of clusters', function(done){
      kmeans.clusterize({}, {k: 3}, function(err,res) {
        should.not.exist(res);
        err.should.equal('The number of points must be greater than the number k of clusters');
        done(); 
      });
    });

  });

  describe('#clusterize() results', function(){

    it('should return a result (array)', function(done){
      kmeans.clusterize(data3D, {k: 3}, function(err,res) {
        should.not.exist(err);
        should.exist(res);
        res.should.have.length(3);
        done();
      });
    });

  });

});
