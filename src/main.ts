import { EnvConfig } from './common/config/env';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions } from '@nestjs/swagger';
import { config as awsConfig } from 'aws-sdk';
import * as bodyParser from 'body-parser';
import { Log } from './common/utils/logging/log.service';
import { ValidationPipe } from '@nestjs/common';

/**
 * Set AWS Credentials
 */

awsConfig.update({
    accessKeyId: EnvConfig.AWS_ACCESS_KEY,
    secretAccessKey: EnvConfig.AWS_SECRET_ACCESS_KEY,
    region: EnvConfig.AWS_REGION
});

async function bootstrap() {

    const app = await NestFactory.create(ApplicationModule);

    app.use(bodyParser.json());

    app.useGlobalPipes(new ValidationPipe());

    /**
     * Headers setup
     */
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });

    /**
     * Swagger implementation
     */
    let options = new DocumentBuilder()
        .setTitle('Chainservice API')
        .setDescription('The Chainservice API')
        .setVersion('1.1')
        .setExternalDoc('Github repo', 'https://github.com/wearetheledger/hyperledger-typescript-boilerplate');

    let swaggerOptions: SwaggerCustomOptions = {};

    if (EnvConfig.AUTH0_DOMAIN) {
        options = options.addOAuth2('implicit', `https://${EnvConfig.AUTH0_DOMAIN}/authorize`, `https://${EnvConfig.AUTH0_DOMAIN}/oauth/token`);

        swaggerOptions = {
            swaggerOptions: {
                oauth2RedirectUrl: `${EnvConfig.DOMAIN_URL}/api/oauth2-redirect.html`,
                oauth: {
                    clientId: EnvConfig.AUTH0_CLIENT_ID,
                    appName: 'Chainservice API',
                    scopeSeparator: ' ',
                    additionalQueryStringParams: { audience: EnvConfig.AUTH0_AUDIENCE }
                }
            }
        };
    }

    const document = SwaggerModule.createDocument(app, options.build());

    SwaggerModule.setup('/api', app, document, {
        swaggerOptions
    });

    /**
     * Start Chainservice API
     */
    await app.listen(+EnvConfig.PORT, () => {
        Log.config.info(`Started Chain-service on PORT ${EnvConfig.PORT}`);
    });

}

bootstrap();