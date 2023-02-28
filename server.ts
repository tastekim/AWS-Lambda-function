import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handler as getDiseasesData } from './getDiseasesData';
import { handler as getAllDiseasesData } from './getAllDiseasesData';

import { decompress } from 'compress-json';

const app = express();

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
        const data = await getDiseasesData(req, res)
        res.status(data.statusCode).send({
            body: JSON.parse(data.body)
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }
});

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));

