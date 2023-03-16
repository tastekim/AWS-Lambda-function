import { storage } from './gcs-connect';
import { connectToDatabase } from './db-connect';

const categoryMap = {
    '감염성질환' : 'gysjh',
    '건강증진' : 'ggjj',
    '근골격질환' : 'gggjh',
    '기타' : 'gt',
    '뇌/신경/정신질환' : 'nsgjsjh',
    '눈/코/귀/인후/구강/치아' : 'nkgihggca',
    '소아/신생아 질환' : 'sassajh',
    '소화기계 질환' : 'shggjh',
    '순환기(심혈관계)질환' : 'shgshggjh',
    '신장/비뇨기계 질환' : 'sjbnggjh',
    '여성질환' : 'ysjh',
    '유방/내분비질환' : 'ybnbbjh',
    '유전질환' : 'yj',
    '응급질환' : 'ugjh',
    '피부/미용/성형 질환' : 'pbmyshjh',
    '혈액/종양 질환' : 'hejyjh',
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
        const bucket = storage.bucket('diseaseswiki.appspot.com');

        // thumbnail image url
        let file = bucket.file(`thumbnails/${doc.filename}`)
        const [thumbnailUrl] = await file.getSignedUrl({
            action : 'read',
            expires : Date.now() + Date.now(),
        });

        // webzine image url
        file = bucket.file(`webzines/${doc.filename}`)
        const [webzineUrl] = await file.getSignedUrl({
            action : 'read',
            expires : Date.now() + Date.now(),
        })

        return {
            thumbnailUrl, webzineUrl
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}

export async function getTopImageUrl(doc) {
    try {
        const bucket = storage.bucket('diseaseswiki.appspot.com');

        let mappingCategory;
        for (const key in categoryMap) {
            if (key == doc.category) {
                mappingCategory = categoryMap[key];
            }
        }
        
        // top image url
        const file = bucket.file(`topimages/${mappingCategory}.jpg`)
        const [topImageUrl] = await file.getSignedUrl({
            action : 'read',
            expires : Date.now() + Date.now(),
        })
        
        return topImageUrl
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
            const url = await getFileUrl(data);
            await db.collection('disease-images').findOneAndUpdate({ _id : data._id }, {
                $set : {
                    url : url
                }
            });
        });
        return result;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            return err;
        }
    }
}