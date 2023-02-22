import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(process.env.MONGODB_URI);

    // Specify which database we want to use
    const db = await client.db('sample_mflix');

    cachedDb = db;
    return db;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const { theaterId } = event.queryStringParameters;
    const db = await connectToDatabase();
    const movies = await db.collection('theaters').findOne({"theaterId" : Number(theaterId)});
    return {
        statusCode : 200,
        body : JSON.stringify(movies),
    };
};