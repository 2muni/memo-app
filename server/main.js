import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY
import mongoose from 'mongoose';
import session from 'express-session';
 
// file import
import api from './routes';

const app = express();

/* mongodb connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server'); });
mongoose.connect('mongodb://localhost/Memo_app_tuts');

app.use(session({
  secret: 'CodeLab1$1$234',
  resave: false,
  saveUninitialized: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
// routes '/api' 로 들어오는 요청울 routes 폴더의 라우트들로 위임
app.use('/api', api);

const port = 3000;
const devPort = 4000;
 
app.use('/', express.static(path.join(__dirname, './../dist')));
// render config
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './../dist/index.html'));
});

app.get('/hello', (req, res) => {
    return res.send('Hello Memo_App!!');
});
 
app.listen(port, () => {
    console.log('Express is listening on port', port);
});
 
if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
