/*!
 * node-kmeans
 * Copyright(c) 2012 Philmod <philippe.modard@gmail.com>
 * MIT Licensed
 */

/*
Asynchronous implementation of the k-means clustering algorithm.

The kmeans function takes as input the number k of clusters and a list of N input vectors and it outputs an object with two attributes:
  - centroids: an Array of k vectors containing the centroid of each cluster
  - assignments: An Array of size N representing for each input vector the index of the cluster

The kmeans will return an error if:
  - N < k
  - The number of different input vectors is smaller than k
*/


 /**
 * Module dependencies.
 */

var _ = require('underscore');


 /**
 * Library version.
 */

exports.version = '0.0.1';


/**
 * Expose 'clusterize' which creates a new 'clusterize' class.
 */

exports.clusterize = function(vector, options, callback) {
  return new clusterize(vector, options, callback);
};


/**
 * Initialize a new `clusterize` with the given `vector` and number `k` of clusters.
 *
 * @param {Array} vector
 * @param {Number} k
 * @api public
 */

function clusterize(vector, options, callback) {
  if (!callback || !options || !vector) throw new Error('Provide 3 arguments: vector, options, callback');
  if (typeof callback != 'function') throw new Error('Provide a callback function');
  if (!options || !options.k || options.k<1) return callback(new Error('Provide a correct number k of clusters'));
  if (!_.isArray(vector)) return callback(new Error('Provide an array of data'));
  this.options = options;
  this.v = this.checkV(vector);
  this.k = this.options.k;
  if (this.v.length < this.k) return callback(new Error('The number of points must be greater than the number k of clusters'));
  
  this.initialize(); // initialize the group arrays

  var self  = this
    , moved = -1; // how many centroids have moved on the last iteration

  (function iterate() {
    if (moved === 0) return callback(null,self.output()); // converged if 0 centroid has moved
    moved = 0;
    for (var i=0; i<self.groups.length; ++i) {
      self.groups[i].defineCentroid(self);  // define the new centroids
      self.groups[i].distanceObjects(self); // calculate the distances from centroids to every items
    }
    self.clustering(); // clustering by choosing the centroid the closest of each item
    for (var i=0; i<self.groups.length; ++i)
      if (self.groups[i].centroidMoved) moved++; // check how many centroids have moved in this iteration
    process.nextTick(iterate);
  })();
};


/**
 * Check vector
 *   - if all the elements have the same dimension
 *   - parseFloat()
 *   - !isNaN()
 */
clusterize.prototype.checkV = function(v) {
  var dim = 1;
  if (_.isArray(v[0])) dim = v[0].length;
  for (var i=0; i<v.length; ++i) {
    if (!_.isArray(v[i])) {
      if (dim!=1) throw new Error('All the elements must have the same dimension');
      v[i] = parseFloat(v[i]);
      if (isNaN(v[i])) throw new Error('All the elements must be float type');
    }
    else {
      if (v[i].length != dim) throw new Error('All the elements must have the same dimension');
      for (var j=0; j<v[i].length; ++j) {
        v[i][j] = parseFloat(v[i][j]);
        if (isNaN(v[i][j])) throw new Error('All the elements must be float type');
      }
    }
  }
  return v;
};


/**
 * Initialize the groups arrays
 */
clusterize.prototype.initialize = function() {
  this.groups   = new Array();
  for (var i=0; i<this.k; ++i)
    this.groups[i]   = new Group(this);
  this.indexes = new Array(); // used to choose randomly the initial centroids
  for (var i=0; i<this.v.length; ++i) 
    this.indexes[i] = i;
  return this;
};


/**
 * assign each object based on the minimum distance
 */

clusterize.prototype.clustering = function() {  
  for (var j=0; j<this.groups.length; ++j) this.groups[j].initCluster();
  for (var i=0; i<this.v.length; ++i) {
    var min = this.groups[0].distances[i];
    var indexGroup = 0;
    for (var j=1; j<this.groups.length; ++j) {
      if (this.groups[j].distances[i] < min) {
        min = this.groups[j].distances[i]
        indexGroup = j;
      }
    }
    this.groups[indexGroup].cluster.push(this.v[i]); 
    this.groups[indexGroup].clusterInd.push(i); 
  }  
  return this;
};


/**
 * output structure
 */

clusterize.prototype.output = function() {
  var out = new Array();
  for (var j=0; j<this.groups.length; ++j) {
    out[j] = _.pick(this.groups[j],'centroid','cluster','clusterInd');
  }
  return out;
};


/**
 * Compute the Euclidean distance
 *
 * @param {Array} a
 * @param {Array} b
 * @api private
 */

function distance(a,b){
  if (a.length != b.length) return (new Error('The vectors must have the same length'));
  var d = 0.0;
  for (var i=0; i<a.length; ++i) d += Math.pow((a[i]-b[i]),2);
  return Math.sqrt(d);
};


/**
 * Group
 */

function Group() {
  this.centroidMoved = true;
}


/**
 * Group
 */

Group.prototype.initCluster = function() {
  this.cluster = new Array(); // dimensions
  this.clusterInd = new Array(); // index
}


/**
 * Define Centroid
 *  - if they exist, calculate the new position
 *  - otherwise, randomly choose one existing item
 */

Group.prototype.defineCentroid = function(self){
  this.centroidOld = (this.centroid) ? this.centroid : new Array();
  if (this.centroid && this.cluster.length>0) {
    this.calculateCentroid();
  }
  else { // random selection
    var i = Math.floor(Math.random() * self.indexes.length);
    this.centroidIndex = self.indexes[i];
    self.indexes.splice(i,1);
    this.centroid = new Array();
    if (!_.isArray(self.v[this.centroidIndex])) { // only one dimension
      this.centroid[0] = self.v[this.centroidIndex];
    }
    else {
      for (var i=0; i<self.v[this.centroidIndex].length; ++i) 
        this.centroid[i] = self.v[this.centroidIndex][i];
    }
  }
  this.centroidMoved = (_.isEqual(this.centroid,this.centroidOld)) ? false : true;
  if (this.centroid.length == 0) console.log('1. was passiert hier??');
  return this;
};


/**
 * calculate Centroid
 */

Group.prototype.calculateCentroid = function() {
  this.centroid = new Array();
  for (var i=0; i<this.cluster.length; ++i) { // loop through the cluster elements
    for (var j=0; j<this.cluster[i].length; ++j) // loop through the dimensions
      this.centroid[j] = (this.centroid[j]) ? this.centroid[j]+this.cluster[i][j] : this.cluster[i][j];
  }
  for (var i=0; i<this.centroid.length; ++i)
    this.centroid[i] = this.centroid[i]/this.cluster.length; // average
  return this
};


/**
 * calculate the distance between cluster centroid to each object
 */

Group.prototype.distanceObjects = function(self) {
  if (!this.distances) this.distances = new Array();
  for (var i=0; i<self.v.length; ++i) {
    this.distances[i] = distance(this.centroid, self.v[i]);
  }
  return this;
};

exports._class = clusterize;
