import { Mongo } from 'meteor/mongo'

const _ensureMongo = id => (id instanceof Mongo.ObjectID ? id : new Mongo.ObjectID(id))

export const ensureMongo = x => (Array.isArray(x) ? x.map(_ensureMongo) : _ensureMongo(x))

const _ensureString = id => {
  if (id instanceof Mongo.ObjectID) {
    return id._str
  } else if (id instanceof String) {
    return id
  } else {
    throw new Error('unknow id type')
  }
}

export const ensureString = x => (Array.isArray(x) ? x.map(_ensureString) : _ensureString(x))

export const getStringID = item => (typeof item._id === 'string' ? item._id : item._id._str)
