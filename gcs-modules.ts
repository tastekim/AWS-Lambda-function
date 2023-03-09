import { storage } from './gcs-connect';
import { connectToDatabase } from './db-connect';

export async function uploadImg(filename, filepath) {
    try {
        const options = {
            destination: filename
        }
        await storage.bucket('diseaseswiki.appspot.com').upload(filepath, options);
        console.log(`${filepath} uploaded successfully to diseaseswiki.appspot.com bucket.`);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}

export async function getFileUrl(fileName) {
    try {
        const bucket = storage.bucket('diseaseswiki.appspot.com');
        const file = bucket.file(fileName);
        const [url] = await file.getSignedUrl({
            action : 'read',
            expires : Date.now() + Date.now(),
        });
        return url
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}