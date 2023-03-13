import { connectToDatabase } from './db-connect';
import { shuffle } from 'fast-shuffle';
import { ObjectId } from 'mongodb';

export async function getDiseasesData(docId) {
    try {
        const db = await connectToDatabase();
        const data = await db.collection('diseases').findOne({ _id : docId });
        let img = await getDiseaseImages(data?.category);
        let arr;
        // 관련 카테고리 이미지
        if (!(img instanceof Array)) {
            throw new Error('Not exist Disease images.')
        }
        const sharr = shuffle(img);
        arr = sharr.slice(0, 3);

        // 3개 이하일 때 나머지 부족한 만큼 랜덤으로 채우기
        if (arr.length < 3) {
            img = await db.collection('disease-images').find({}).toArray();
            const sharr = shuffle(img);
            let i = 0;
            while (arr.length < 3) {
                arr.push(sharr[i]);
                i++;
            }
        }
        return { data, arr };
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode : 500,
                message : err.message,
            };
        }
    }
}

export async function getDiseaseImages(category) {
    try {
        const db = await connectToDatabase();
        const data = await db.collection('disease-images').find({ $or : [{ category1 : category }, { category2 : category }] }).toArray();
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

export async function getSeasonImg() {
    try {
        const db = await connectToDatabase();
        const date = new Date();
        const month = date.getMonth();
        let season;
        if (3 <= month && month <= 4) {
            season = '봄';
        } else if (5 <= month && month <= 7) {
            season = '여름';
        } else if (8 <= month && month <= 9) {
            season = '가을';
        } else {
            season = '겨울';
        }
        const data = await db.collection('disease-images').find({ $or : [{ season : '전체' }, { season : season }] }).toArray();
        console.log(data);
        const shuffleArr = shuffle(data);
        return shuffleArr.slice(0, 3);
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return err;
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

export async function setImgData(doc, url) {
    try {
        const db = await connectToDatabase();
        return await db.collection('disease-images').insertOne({
            title : doc.title,
            filename : doc.filename,
            created_at : doc.created_at,
            season : doc.season,
            category1 : doc.category1,
            category2 : doc.category2,
            url : url

        });
    } catch (err) {
        if (err instanceof Error) {
            return {
                statusCode : 500,
                message : err.message,
            };
        }
    }
}
