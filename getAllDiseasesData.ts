import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { compress } from 'compress-json';
import { getAllDiseasesData } from './mongodb-modules';

interface QueryStringParam {
    comp?: string;
}

interface ModifiedAPIGatewayEvent {
    queryStringParameters: QueryStringParam;
}

export const handler = async (event: ModifiedAPIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const allData = await getAllDiseasesData();
        const { comp } = event.queryStringParameters || {};
        const resBody = {data: allData}

        return {
            statusCode : 200,
            body : JSON.stringify(comp === 'f' ? resBody : compress(resBody)),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};