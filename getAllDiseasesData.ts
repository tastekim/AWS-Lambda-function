import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { compress } from 'compress-json';
import { connectToDatabase } from './db-connect';

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