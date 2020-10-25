// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var api_pb = require('./api_pb.js');

function serialize_CreateProcessingReq(arg) {
  if (!(arg instanceof api_pb.CreateProcessingReq)) {
    throw new Error('Expected argument of type CreateProcessingReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateProcessingReq(buffer_arg) {
  return api_pb.CreateProcessingReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateProcessingRes(arg) {
  if (!(arg instanceof api_pb.CreateProcessingRes)) {
    throw new Error('Expected argument of type CreateProcessingRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateProcessingRes(buffer_arg) {
  return api_pb.CreateProcessingRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetProcessingReq(arg) {
  if (!(arg instanceof api_pb.GetProcessingReq)) {
    throw new Error('Expected argument of type GetProcessingReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetProcessingReq(buffer_arg) {
  return api_pb.GetProcessingReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetProcessingRes(arg) {
  if (!(arg instanceof api_pb.GetProcessingRes)) {
    throw new Error('Expected argument of type GetProcessingRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetProcessingRes(buffer_arg) {
  return api_pb.GetProcessingRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UploadUrlReq(arg) {
  if (!(arg instanceof api_pb.UploadUrlReq)) {
    throw new Error('Expected argument of type UploadUrlReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UploadUrlReq(buffer_arg) {
  return api_pb.UploadUrlReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UploadUrlRes(arg) {
  if (!(arg instanceof api_pb.UploadUrlRes)) {
    throw new Error('Expected argument of type UploadUrlRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UploadUrlRes(buffer_arg) {
  return api_pb.UploadUrlRes.deserializeBinary(new Uint8Array(buffer_arg));
}


var ApiService = exports.ApiService = {
  getUploadUrl: {
    path: '/Api/getUploadUrl',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.UploadUrlReq,
    responseType: api_pb.UploadUrlRes,
    requestSerialize: serialize_UploadUrlReq,
    requestDeserialize: deserialize_UploadUrlReq,
    responseSerialize: serialize_UploadUrlRes,
    responseDeserialize: deserialize_UploadUrlRes,
  },
  createProcessingJob: {
    path: '/Api/createProcessingJob',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.CreateProcessingReq,
    responseType: api_pb.CreateProcessingRes,
    requestSerialize: serialize_CreateProcessingReq,
    requestDeserialize: deserialize_CreateProcessingReq,
    responseSerialize: serialize_CreateProcessingRes,
    responseDeserialize: deserialize_CreateProcessingRes,
  },
  getProcessingJob: {
    path: '/Api/getProcessingJob',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.GetProcessingReq,
    responseType: api_pb.GetProcessingRes,
    requestSerialize: serialize_GetProcessingReq,
    requestDeserialize: deserialize_GetProcessingReq,
    responseSerialize: serialize_GetProcessingRes,
    responseDeserialize: deserialize_GetProcessingRes,
  },
};

exports.ApiClient = grpc.makeGenericClientConstructor(ApiService);
