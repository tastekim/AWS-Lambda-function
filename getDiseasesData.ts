import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getDiseasesData } from './mongodb-modules';

interface QueryStringParam {
    docId: string;
}

interface ModifiedAPIGatewayEvent {
    queryStringParameters: QueryStringParam;
}

export const handler = async (event: ModifiedAPIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const { docId } = event.queryStringParameters || {};
        const data = await getDiseasesData(docId);

        if (!data) {
            return {
                statusCode : 500,
                body : JSON.stringify(data),
            };
        } else {
            return {
                statusCode : 200,
                body : JSON.stringify(data),
            };
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};