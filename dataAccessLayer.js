
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const databaseName = 'final-project-api';
const collectionName = 'articles';

const mongoDbUrl = process.env.MONGODB_CONNECTION_STRING;
// const mongoDbUrl = 'asdasdasd';
const settings = {
    useUnifiedTopology: true
};
console.log('mongoDbUrl: ' + mongoDbUrl);

let database;

const Connect = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoDbUrl, settings, function(err, client) {
            if(err) {
                reject(err);
            }
            else {
                console.log('SUCCESSFULLY CONNECTED TO DATABASE!');
                database = client.db(databaseName);
                resolve();
            }
        });
    });
};

const Insert = function(article) {
    return new Promise((resolve, reject) => {
        const articleCollection = database.collection(collectionName);

        articleCollection.insertOne(article, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('SUCCESSFULLY INSERTED A NEW DOCUMENT');
                resolve(res);
            }
        });
    });
};

const Remove = function(product) {
    return new Promise((resolve, reject) => {
      const productCollection = database.collection(collectionName);
  
      productCollection.deleteOne(product, function(err, res) {
        if (err) {
          reject(err);
        } 
        else {
          console.log("Removed successfully!");
          resolve(res);
        }
      });
    });
  };

const Find = function(options = {}) {
    let query = {
        objectQuery: {},
        sort: {},
        skip: 0,
        limit: 0,
    };

    if(options) {
        if(options.filterBy && options.filterByValue) {
            query.objectQuery[options.filterBy] = { $regex: `.*${options.filterByValue}.*`, $options: 'i' };
        }

        if(options.orderBy && options.orderByValue) {
            query.sort[options.orderBy] = (options.orderByValue === 'asc' ? 1 : -1);
        }

        if(options.page && options.perPage) {
            query.skip = (options.page - 1) * options.perPage;
            query.limit = options.perPage;
        }
    }

    return new Promise((resolve, reject) => {
        const collection = database.collection(collectionName);

        collection
            .find(query.objectQuery) // Search and Filter
            .skip(query.skip) // Pagination
            .limit(query.limit) // Pagiation
            .sort(query.sort) // Sorting Order
            .toArray(function(err, res) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
        });
    });
};

module.exports = { Connect, Insert, Find, Remove };