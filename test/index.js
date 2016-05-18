'use strict';

const kmeans = require('../');
const should = require('should');

/**
 * Data (expressly very separated)
 */
const data3D = [
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
  [40.25, -198, 562],
];

/**
 * Tests
 */
describe('kmeans', () => {
  describe('#clusterize() errors', () => {
    it('should throw an error if there aren\'t 3 arguments', () => {
      (() => {
        kmeans.clusterize();
      }).should.throw('Provide 3 arguments: vector, options, callback');
      (() => {
        kmeans.clusterize({});
      }).should.throw('Provide 3 arguments: vector, options, callback');
      (() => {
        kmeans.clusterize({}, {});
      }).should.throw('Provide 3 arguments: vector, options, callback');
    });

    it('should throw an error if no callback function', () => {
      (() => {
        kmeans.clusterize([], {}, {});
      }).should.throw('Provide a callback function');
    });

    it('should throw an error if no \'k\' option', done => {
      kmeans.clusterize({}, { k: 3 }, (err, res) => {
        should.not.exist(res);
        should.exist(err);
        done();
      });
    });

    it('should return an error if the data vector is not an array', done => {
      kmeans.clusterize({}, { k: 3 }, (err, res) => {
        should.not.exist(res);
        should.exist(err);
        done();
      });
    });

    it(`should return an error if the number of points is smaller than the
      number k of clusters`, done => {
      kmeans.clusterize({}, { k: 3 }, (err, res) => {
        should.not.exist(res);
        should.exist(err);
        done();
      });
    });
  });

  describe('#clusterize() results', () => {
    it('should return a result (array)', done => {
      kmeans.clusterize(data3D, { k: 3 }, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.should.have.length(3);
        done();
      });
    });

    it('should return 2 groups with the 2 vectors', done => {
      kmeans.clusterize([[1, 1], [2, 2]], { k: 2 }, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.should.have.length(2);

        if (res[0].centroid[0] === 1) {
          res[0].centroid[1].should.equal(1);
          res[1].centroid[0].should.equal(2);
          res[1].centroid[1].should.equal(2);
        } else if (res[0].centroid[0] === 2) {
          res[0].centroid[1].should.equal(2);
          res[1].centroid[0].should.equal(1);
          res[1].centroid[1].should.equal(1);
        } else {
          throw new Error('should return a 2 groups with the 2 points');
        }
        done();
      });
    });
  });
});
