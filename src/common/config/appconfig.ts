import { EnvConfig } from './env';
import * as path from 'path';
import { ConfigOptions } from './config.model';
import { PusherService } from '../../core/events/pusher/pusher.service';
import { Auth0AuthenticationService } from '../../core/authentication/auth0/auth0-authentication.service';
import { HeaderAuthenticationService } from '../../core/authentication/headerMock/header-authentication.service';

export const Appconfig: ConfigOptions = {
    hlf: {
        walletPath: path.resolve(__dirname, `creds`),
        userId: 'admin',
        channelId: 'mychannel',
        chaincodeId: 'food-app',
        networkUrl: `grpc://${EnvConfig.PEER_HOST}:17051`,
        eventUrl: `grpc://${EnvConfig.PEER_HOST}:7052`,
        ordererUrl: `grpc://${EnvConfig.ORDERER_HOST}:7050`,
        caUrl: `http://${EnvConfig.CA_HOST}:7054`,
        admin: {
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
            MspID: 'Org1MSP'
        },
        tlsOptions: {
            trustedRoots: [],
            verify: false
        },
        caName: 'ca.org1.example.com'
    },
    allowguest: true
} as ConfigOptions;

export const EventService = { provide: 'IEventService', useClass: PusherService };
export const AuthService = { provide: 'IAuthService', useClass: EnvConfig.AUTH0_DOMAIN ? Auth0AuthenticationService : HeaderAuthenticationService };
