import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getDiseasesData, updateDiseaseData } from './mongodb-modules';

interface QueryStringParam {
    docId: string;
    admin: string;
}

interface ModifiedAPIGatewayEvent {
    queryStringParameters: QueryStringParam;
    body: any;
}

export const handler = async (event: ModifiedAPIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const { docId, admin } = event.queryStringParameters || {};

        if (typeof event.body === 'string' && admin === 'true') {
            const updateDoc = JSON.parse(event.body)
            await updateDiseaseData(docId, updateDoc);
        }
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