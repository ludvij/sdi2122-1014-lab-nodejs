const {ObjectId} = require("mongodb");
module.exports = {
    mongoClient: null,
    app: null,
    init: (app, mongoClient) => {
        this.mongoClient = mongoClient
        this.app = app
    },
    findComment: async (filter, options) => {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'comments';
            const commentCollection = database.collection(collectionName);
            const comment = await commentCollection.findOne(filter, options);
            return comment;
        } catch (error) {
            throw (error);
        }
    },
    getComments: async (filter, options) => {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'))
            const database = client.db("musicStore")
            const collectionName = 'comments'
            const commentsCollection = database.collection(collectionName)
            const comments = await commentsCollection.find(filter, options).toArray()
            return comments;
        } catch (error) {
            throw (error)
        }
    },
    insertComment: async (comment) => {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'))
            const database = client.db("musicStore")
            const collectionName = 'comments'
            const commentsCollection = database.collection(collectionName)
            const result = await commentsCollection.insertOne(comment)
            return result.insertedId
        } catch (error) {
            throw (error)
        }
    },
    deleteComment: async (comment) => {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'))
            const database = client.db("musicStore")
            const collectionName = 'comments'
            const commentsCollection = database.collection(collectionName)
            const result = await commentsCollection.deleteOne(comment)
            // if deleted acknowledged is true
            return result.acknowledged
        } catch (error) {
            throw error
        }
    },
    deleteCommentById: async (id) => {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'))
            const database = client.db("musicStore")
            const collectionName = 'comments'
            const commentsCollection = database.collection(collectionName)
            const result = await commentsCollection.deleteOne({_id: id})
            // if deleted acknowledged is true
            return result.acknowledged
        } catch (error) {
            throw error
        }
    }
};