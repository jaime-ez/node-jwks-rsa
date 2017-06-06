'use strict';

var _errors = require('../errors');

var _JwksClient = require('../JwksClient');

var handleSigningKeyError = function handleSigningKeyError(err, cb) {
  // If we didn't find a match, can't provide a key.
  if (err && err.name === 'SigningKeyNotFoundError') {
    return cb(null, null, null);
  }

  // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
  if (err) {
    return cb(err, null, null);
  }
};

module.exports.koaJwt2Key = function (options) {
  if (options === null || options === undefined) {
    throw new _errors.ArgumentError('An options object must be provided when initializing expressJwtSecret');
  }

  var client = new _JwksClient.JwksClient(options);
  var onError = options.handleSigningKeyError || handleSigningKeyError;

  return function secretProvider(decodedHeader) {
    return new Promise(function(resolve, reject) {
      // We cannot find a signing certificate if there is no header (no kid).
      if (!decodedHeader || !decodedHeader.kid) {
        reject(null);
      }

      // Only RS256 is supported.
      if (decodedHeader.alg !== 'RS256') {
        reject(null);
      }

      client.getSigningKey(decodedHeader.kid, function (err, key) {
        if (err) {
          return onError(err, function (newError) {
            reject(newError);
          });
        }

        // Provide the key.
        resolve(key.publicKey || key.rsaPublicKey);
      })
    });
  };
};
