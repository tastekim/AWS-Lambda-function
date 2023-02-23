import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import { compress } from 'compress-json';

async function connectToDatabase() {
    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(`${process.env.MONGODB_URI}`);

    // Specify which database we want to use
    const db = await client.db('sample_illcyclopedia');

    return db;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const db = await connectToDatabase();
    const movies = await db.collection('diseases').find({}).toArray();
    const comp: unknown = event.queryStringParameters;

    if (typeof comp === 'undefined') {
        return {
            statusCode : 200,
            body : JSON.stringify(movies),
        };
    } else {
        const compressed = compress(movies);
        return {
            statusCode : 200,
            body : JSON.stringify(compressed),
        };
    }
};