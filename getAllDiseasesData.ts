import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { compress } from 'compress-json';
import { connectToDatabase } from './db-connect';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const db = await connectToDatabase();
        const movies = await db.collection('diseases').find({}).toArray();
        const { comp } = event?.queryStringParameters || {};
        if (comp === 'F' || comp === 'T' || typeof comp === 'undefined') {
            return {
                statusCode : 200,
                body : JSON.stringify(comp ==='F' ? movies : compress(movies))
            }
        } else {
            return {
                statusCode : 404,
                body : JSON.stringify({message: 'Invalid query string.'})
            }
        }
        // if (comp === 'F') {
        //     return {
        //         statusCode : 200,
        //         body : JSON.stringify(movies)
        //     };
        // } else if (comp === 'T' || typeof comp === 'undefined') {
        //     return {
        //         statusCode : 200,
        //         body : JSON.stringify(compress(movies))
        //     };
        // } else {
        //     return {
        //         statusCode : 404,
        //         body : 'Invalid query string.'
        //     };
        // }
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};