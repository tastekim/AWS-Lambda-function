import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handler as getDiseasesData } from './getDiseasesData';
import { handler as getAllDiseasesData } from './getAllDiseasesData';
import {
    uploadImg,
    getFileUrl,
    getAllFiles,
    allContentsChange
} from './gcs-modules';
import {
    setImgData,
    getDiseaseImages,
    getSeasonImg,
    setDiseasesData_topImg,
} from './mongodb-modules';

import { decompress } from 'compress-json';
import bodyParser from 'body-parser';
import formidable from 'formidable';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.get('/getAll', async (req: any, res: any) => {
    try {
        req.queryStringParameters = req.query;
        const allData = await getAllDiseasesData(req, res);
        res.status(allData.statusCode).send(allData);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }

});

app.post('/getOne', async (req: any, res: any) => {
    try {
        req.queryStringParameters = req.query;
        console.log(req)
        const data = await getDiseasesData(req, res);
        res.status(data.statusCode).send({
            body : JSON.parse(data.body)
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
});

app.post('/uploadimgs', (req: any, res: any, next) => {
    try {
        const form = formidable({ multiple : true, multiples : true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }

            const { title, season, category1, category2, created_at } = fields;
            const doc = {
                title,
                season,
                category1,
                category2,
                created_at,
                filename : files.file.originalFilename,
            };

            await uploadImg(files.file.originalFilename, files.file.filepath);
            const url = await getFileUrl(doc);
            const result = await setImgData(doc, url);
            console.log(result);
            res.json({ files, url });
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
});

// 메인 페이지에서 시즌에 맞는 랜덤 webzine 이미지 3개 return.
app.get('/getSeasonImg', async (req: any, res: any) => {
    try {
        const result = await getSeasonImg();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// 질병 document 업데이트 시, google cloud storage 에 해당 이미지 파일 업로드 후 실행해서 맞는 카테고리 및 파일 이미지 매핑.
app.get('/diseaseImgMapping', async (req: any, res: any) => {
    try {
        // disease-images collection의 document의 url 한번에 전체 수정 -> doc에 해당하는 thumbnail, top-image, webzine image url mapping.
        const result = await allContentsChange();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

// 질병 데이터에 top image 추가(전체에 실행)
app.get('/setDiseasesTopImage', async (req: any, res: any) => {
    try {
        await setDiseasesData_topImg();
        res.json({ message : 'success' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));

