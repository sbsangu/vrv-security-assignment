import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { Logger } from './utils/logger.util';
import config from './config/serverConfig';
import apiRoute from './routes'
import connectToDb from './config/db.config';

dotenv.config();

const app: Express = express();
const port = config.PORT || 3000;
const logger = new Logger('Index');

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api', apiRoute);


app.get('/', (req: Request, res: Response) => {
  res.send('VRV Security Backend');
});


app.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);
  await connectToDb();

});





