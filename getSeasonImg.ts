import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getSeasonImg } from './mongodb-modules';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const data = await getSeasonImg();

        return {
            statusCode : 200,
            body : JSON.stringify({ data }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};