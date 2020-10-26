/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./api_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ApiClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ApiPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.UploadUrlReq,
 *   !proto.UploadUrlRes>}
 */
const methodDescriptor_Api_getUploadUrl = new grpc.web.MethodDescriptor(
  '/Api/getUploadUrl',
  grpc.web.MethodType.UNARY,
  proto.UploadUrlReq,
  proto.UploadUrlRes,
  /**
   * @param {!proto.UploadUrlReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UploadUrlRes.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.UploadUrlReq,
 *   !proto.UploadUrlRes>}
 */
const methodInfo_Api_getUploadUrl = new grpc.web.AbstractClientBase.MethodInfo(
  proto.UploadUrlRes,
  /**
   * @param {!proto.UploadUrlReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UploadUrlRes.deserializeBinary
);


/**
 * @param {!proto.UploadUrlReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.UploadUrlRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.UploadUrlRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ApiClient.prototype.getUploadUrl =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Api/getUploadUrl',
      request,
      metadata || {},
      methodDescriptor_Api_getUploadUrl,
      callback);
};


/**
 * @param {!proto.UploadUrlReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.UploadUrlRes>}
 *     Promise that resolves to the response
 */
proto.ApiPromiseClient.prototype.getUploadUrl =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Api/getUploadUrl',
      request,
      metadata || {},
      methodDescriptor_Api_getUploadUrl);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.CreateProcessingReq,
 *   !proto.CreateProcessingRes>}
 */
const methodDescriptor_Api_createProcessingJob = new grpc.web.MethodDescriptor(
  '/Api/createProcessingJob',
  grpc.web.MethodType.UNARY,
  proto.CreateProcessingReq,
  proto.CreateProcessingRes,
  /**
   * @param {!proto.CreateProcessingReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.CreateProcessingRes.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.CreateProcessingReq,
 *   !proto.CreateProcessingRes>}
 */
const methodInfo_Api_createProcessingJob = new grpc.web.AbstractClientBase.MethodInfo(
  proto.CreateProcessingRes,
  /**
   * @param {!proto.CreateProcessingReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.CreateProcessingRes.deserializeBinary
);


/**
 * @param {!proto.CreateProcessingReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.CreateProcessingRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.CreateProcessingRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ApiClient.prototype.createProcessingJob =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Api/createProcessingJob',
      request,
      metadata || {},
      methodDescriptor_Api_createProcessingJob,
      callback);
};


/**
 * @param {!proto.CreateProcessingReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.CreateProcessingRes>}
 *     Promise that resolves to the response
 */
proto.ApiPromiseClient.prototype.createProcessingJob =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Api/createProcessingJob',
      request,
      metadata || {},
      methodDescriptor_Api_createProcessingJob);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GetProcessingReq,
 *   !proto.GetProcessingRes>}
 */
const methodDescriptor_Api_getProcessingJob = new grpc.web.MethodDescriptor(
  '/Api/getProcessingJob',
  grpc.web.MethodType.UNARY,
  proto.GetProcessingReq,
  proto.GetProcessingRes,
  /**
   * @param {!proto.GetProcessingReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetProcessingRes.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.GetProcessingReq,
 *   !proto.GetProcessingRes>}
 */
const methodInfo_Api_getProcessingJob = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GetProcessingRes,
  /**
   * @param {!proto.GetProcessingReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetProcessingRes.deserializeBinary
);


/**
 * @param {!proto.GetProcessingReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.GetProcessingRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.GetProcessingRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ApiClient.prototype.getProcessingJob =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Api/getProcessingJob',
      request,
      metadata || {},
      methodDescriptor_Api_getProcessingJob,
      callback);
};


/**
 * @param {!proto.GetProcessingReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.GetProcessingRes>}
 *     Promise that resolves to the response
 */
proto.ApiPromiseClient.prototype.getProcessingJob =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Api/getProcessingJob',
      request,
      metadata || {},
      methodDescriptor_Api_getProcessingJob);
};


module.exports = proto;

