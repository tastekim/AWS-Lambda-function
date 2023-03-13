import { storage } from './gcs-connect';
import { connectToDatabase } from './db-connect';

import * as hangul from 'hangul-js';

const categoryMap = {
    '감염성질환' : 'gysjh',
    '건강증진' : 'ggjj',
    '근골격질환' : 'gggjh',
    '기타' : 'gt',
    '뇌/신경/정신질환' : 'nsgjsjh',
    '눈/코/귀/인후/구강/치아' : 'nkgihggca',
    '소아/신생아질환' : 'sassajh',
    '소화기계질환' : 'shggjh',
    '순화기(심혈관계)질환' : 'shgshggjh',
    '신장/비뇨기계질환' : 'sjbnggjh',
    '여성질환' : 'ysjh',
    '유방/내분비질환' : 'ybnbbjh',
    '유전' : 'yj',
    '응급질환' : 'ugjh',
    '피부/미용/성형 질환' : 'pbmyshjh',
    '혈액/종양질환' : 'hejyjh',
    '호흡기질환' : 'hhgjh',
};

export async function uploadImg(filename, filepath) {
    try {
        const options = {
            destination : filename
        };
        await storage.bucket('diseaseswiki.appspot.com').upload(filepath, options);
        console.log(`${filepath} uploaded successfully to diseaseswiki.appspot.com bucket.`);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}

export async function getFileUrl(doc) {
    try {
        let category = doc.category1
        let mappingCategory;
        for (const key in categoryMap) {
            if (key == category) {
                mappingCategory = categoryMap[key];
            }
        }

        if (mappingCategory === undefined || doc.filename === undefined || category === undefined) {
            throw new Error(`Invalid mapping category.`);
        }

        const url = {
            thumbnailUrl : `https://storage.cloud.google.com/diseaseswiki.appspot.com/thumbnails/${encodeURI(doc.filename)}`,
            webzineUrl : `https://storage.cloud.google.com/diseaseswiki.appspot.com/webzines/${encodeURI(doc.filename)}`,
            topImageUrl : `https://storage.cloud.google.com/diseaseswiki.appspot.com/topimages/${mappingCategory}.jpg`,
        }
        return url;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}


export async function getAllFiles(prefix) {
    try {
        const options = { prefix };
        const bucket = storage.bucket('diseaseswiki.appspot.com');
        const [files] = await bucket.getFiles(options);
        const result = files.map((f) => {
            return f.metadata.name;
        });
        return result;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}

// disease-images collection 이미지 경로 한 번에 수정.
export async function allContentsChange() {
    try {
        const db = await connectToDatabase();
        const mongoAll = await db.collection('disease-images').find({}).toArray();

        const bucket = storage.bucket('diseaseswiki.appspot.com');

        const result = mongoAll.forEach(async (data) => {
            const id = data._id;
            const title = data.title;
            const category = data.category1;
            const filename = data.filename;
            let mappingCategory;

            for (const key in categoryMap) {
                if (key == category) {
                    mappingCategory = categoryMap[key];
                }
            }

            if (mappingCategory === undefined || title === undefined || category === undefined) {
                throw new Error(`Invalid mapping category.`);
            }

            let thumbnailUrl = `https://storage.cloud.google.com/diseaseswiki.appspot.com/thumbnails/${encodeURI(filename)}`;
            let webzineUrl = `https://storage.cloud.google.com/diseaseswiki.appspot.com/webzines/${encodeURI(filename)}`;
            let topImageUrl = `https://storage.cloud.google.com/diseaseswiki.appspot.com/topimages/${mappingCategory}.jpg`;

            await db.collection('disease-images').findOneAndUpdate({ _id : id }, {
                $set : {
                    url : {
                        thumbnailUrl,
                        webzineUrl,
                        topImageUrl
                    }
                }
            });
            return {
                id,
                title,
                category,
                thumbnailUrl,
                webzineUrl,
                topImageUrl
            };
        });
        return result;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}