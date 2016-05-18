'use strict';

/*
 * node-kmeans
 * Copyright(c) 2012 Philmod <philippe.modard@gmail.com>
 * MIT Licensed
 */

/*
Asynchronous implementation of the k-means clustering algorithm.

The kmeans function takes as input the number k of clusters and a list of N
input vectors and it outputs an object with two attributes:
  - centroids: an Array of k vectors containing the centroid of each cluster
  - assignments: An Array of size N representing for each input vector the
    index of the cluster

The kmeans will return an error if:
  - N < k
  - The number of different input vectors is smaller than k
*/

const _ = require('underscore');


/**
 * Compute the Euclidean distance
 *
 * @param {Array} a
 * @param {Array} b
 * @api private
 */

function distance(a, b) {
  if (a.length !== b.length) {
    return (new Error('The vectors must have the same length'));
  }
  let d = 0.0;
  for (let i = 0, max = a.length; i < max; ++i) {
    d += Math.pow((a[i] - b[i]), 2);
  }
  return Math.sqrt(d);
}

class Group {
  constructor() {
    this.centroidMoved = true;
  }

  initCluster() {
    this.cluster = []; // dimensions
    this.clusterInd = []; // index
  }

  /**
   * Define Centroid
   *  - if they exist, calculate the new position
   *  - otherwise, randomly choose one existing item
   */
  defineCentroid(self) {
    this.centroidOld = (this.centroid) ? this.centroid : [];
    if (this.centroid && this.cluster.length > 0) {
      this.calculateCentroid();
    } else { // random selection
      const i = Math.floor(Math.random() * self.indexes.length);
      this.centroidIndex = self.indexes[i];
      self.indexes.splice(i, 1);
      this.centroid = [];
      if (!_.isArray(self.v[this.centroidIndex])) { // only one dimension
        this.centroid[0] = self.v[this.centroidIndex];
      } else {
        for (let j = 0, max = self.v[this.centroidIndex].length; j < max; ++j) {
          this.centroid[j] = self.v[this.centroidIndex][j];
        }
      }
    }
    this.centroidMoved = _.isEqual(this.centroid, this.centroidOld);
    return this;
  }

  calculateCentroid() {
    this.centroid = [];
    for (let i = 0; i < this.cluster.length; ++i) { // loop through the cluster elements
      for (let j = 0, max = this.cluster[i].length; j < max; ++j) { // loop through the dimensions
        this.centroid[j] = this.centroid[j]
          ? this.centroid[j] + this.cluster[i][j]
          : this.cluster[i][j];
      }
    }
    for (let i = 0, max = this.centroid.length; i < max; ++i) {
      this.centroid[i] = this.centroid[i] / this.cluster.length; // average
    }
    return this;
  }

  distanceObjects(self) {
    if (!this.distances) {
      this.distances = [];
    }
    for (let i = 0, max = self.v.length; i < max; ++i) {
      this.distances[i] = distance(this.centroid, self.v[i]);
    }
    return this;
  }
}


class Clusterize {
  constructor(vector, options, callback) {
    if (!callback || !options || !vector) {
      throw new Error('Provide 3 arguments: vector, options, callback');
    }
    if (typeof callback !== 'function') {
      throw new Error('Provide a callback function');
    }
    if (!options || !options.k || options.k < 1) {
      return callback(new Error('Provide a correct number k of clusters'));
    }
    if (!_.isArray(vector)) {
      return callback(new Error('Provide an array of data'));
    }

    this.options = options;
    this.v = this.checkV(vector);
    this.k = this.options.k;
    if (this.v.length < this.k) {
      const errMessage = `The number of points must be greater than
      the number k of clusters`;
      return callback(new Error(errMessage));
    }

    this.initialize(); // initialize the group arrays

    const self = this;
    let moved = -1;

    function iterate() {
      if (moved === 0) {
        return callback(null, self.output()); // converged if 0 centroid has moved
      }
      moved = 0;
      for (let i = 0, max = self.groups.length; i < max; ++i) {
        self.groups[i].defineCentroid(self); // define the new centroids
        self.groups[i].distanceObjects(self); // distances from centroids to items
      }
      self.clustering(); // clustering by choosing the centroid the closest of each item
      for (let i = 0, max = self.groups.length; i < max; ++i) {
        // check how many centroids have moved in this iteration
        if (self.groups[i].centroidMoved) {
          moved++;
        }
      }
      return process.nextTick(iterate);
    }
    return iterate();
  }

  checkV(v) {
    let dim = 1;
    if (_.isArray(v[0])) {
      dim = v[0].length;
    }
    for (let i = 0, max = v.length; i < max; ++i) {
      if (!_.isArray(v[i])) {
        if (dim !== 1) {
          throw new Error('All the elements must have the same dimension');
        }
        v[i] = Number(v[i]);
        if (isNaN(v[i])) {
          throw new Error('All the elements must be float type');
        }
      } else {
        if (v[i].length !== dim) {
          throw new Error('All the elements must have the same dimension');
        }
        for (let j = 0, max2 = v[i].length; j < max2; ++j) {
          v[i][j] = Number(v[i][j]);
          if (isNaN(v[i][j])) {
            throw new Error('All the elements must be float type');
          }
        }
      }
    }
    return v;
  }

  initialize() {
    this.groups = [];
    for (let i = 0, max = this.k; i < max; ++i) {
      this.groups[i] = new Group(this);
    }
    this.indexes = []; // used to choose randomly the initial centroids
    for (let i = 0, max = this.v.length; i < max; ++i) {
      this.indexes[i] = i;
    }
    return this;
  }

  clustering() {
    for (let j = 0, max = this.groups.length; j < max; ++j) {
      this.groups[j].initCluster();
    }
    for (let i = 0, max = this.v.length; i < max; ++i) {
      let min = this.groups[0].distances[i];
      let indexGroup = 0;
      for (let j = 1, max2 = this.groups.length; j < max2; ++j) {
        if (this.groups[j].distances[i] < min) {
          min = this.groups[j].distances[i];
          indexGroup = j;
        }
      }
      this.groups[indexGroup].cluster.push(this.v[i]);
      this.groups[indexGroup].clusterInd.push(i);
    }
    return this;
  }

  output() {
    const out = [];
    for (let j = 0, max = this.groups.length; j < max; ++j) {
      out[j] = _.pick(this.groups[j], 'centroid', 'cluster', 'clusterInd');
    }
    return out;
  }
}

exports.clusterize = (vector, options, callback) => {
  return new Clusterize(vector, options, callback);
};

exports._class = Clusterize;
