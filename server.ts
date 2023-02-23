import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handler as getDiseasesData } from './getDiseasesData';
import { handler as getAllDiseasesData } from './getAllDiseasesData';

const app = express();

app.get('/getAllDiseasesData', async (req: any, res: any) => {
    try {
        req.queryStringParameters = req.query;
        const allData = await getAllDiseasesData(req, res);
        console.log(JSON.parse(allData.body));
        res.status(200 || allData.statusCode).send(allData);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).send({ message : err.message });
        }
    }

});

app.get('/getDiseasesData', async (req: Request, res: Response) => {
    // const data = await getDiseasesData(, res);
    // console.log(data);
    res.status(200).send({
        message : 'Ok.',
    });
});

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));

