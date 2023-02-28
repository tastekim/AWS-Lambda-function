import { connectToDatabase } from './db-connect';
import { ObjectId } from 'mongodb';

export async function getDiseasesData(docId) {
    try {
        const db = await connectToDatabase();
        const query = new ObjectId(docId);
        const data = await db.collection('diseases').findOne({ _id : query });
        return data;
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode : 500,
                message : err.message,
            };
        }
    }
}

export async function getAllDiseasesData() {
    try {
        const db = await connectToDatabase();
        return await db.collection('diseases').find({}).toArray();
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode : 500,
                message : err.message,
            };
        }
    }
}