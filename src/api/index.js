import express from 'express';
import { ExpressPeerServer } from 'peer';
import config from '../../config';

const app = express();

const server = app.listen(8004);

const apiRoutes = express.Router();

app.use(config.peerPath, ExpressPeerServer(server, {
    debug: config.debugPeer,
    key: config.peerKey,
    allow_discovery: true,
}));