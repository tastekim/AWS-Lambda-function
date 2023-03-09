import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handler as getDiseasesData } from './getDiseasesData';
import { handler as getAllDiseasesData } from './getAllDiseasesData';
import { uploadImg, getFileUrl } from './gcs-modules';
import { setImgData, getDiseaseImages } from './mongodb-modules';

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

app.get('/getOne', async (req: any, res: any) => {
    try {
        req.queryStringParameters = req.query;
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
            const url = await getFileUrl(files.file.originalFilename);
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

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));

