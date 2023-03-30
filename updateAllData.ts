import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getSeasonImg, setDiseasesData_topImg } from './mongodb-modules';
import { allContentsChange } from './gcs-modules';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const updateData1 = await allContentsChange();
        await setDiseasesData_topImg();

        return {
            statusCode : 200,
            body : JSON.stringify({ message: 'Success process.' }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode : 500,
            body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
        };
    }
};