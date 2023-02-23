import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(`${process.env.MONGODB_URI}`);

    // Specify which database we want to use
    const db = await client.db('sample_illcyclopedia');
    return db;
}