import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';


export default () => {
    const config = yaml.load(
        readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, any>;

    // Validation
    if (config.http.port < 1024 || config.http.port > 49151) {
        throw new Error('HTTP port must be between 1024 and 49151');
    }

    return config;
};

// export default () => ({
//     port: parseInt(process.env.PORT, 10) || 3000,
//     database: {
//       host: process.env.DATABASE_HOST,
//       port: parseInt(process.env.DATABASE_PORT, 10) || 5432
//     }
//   });

// Nest CLI does not automatically move your "assets" (non-TS files) to the dist folder during the build process. To make sure that your YAML files are copied, you have to
// specify this in the compilerOptions#assets object in the nest-cli.json file. As an example, if the config folder is at the same level as the src folder, add
// compilerOptions#assets with the value "assets": [{"include": "../config/*.yaml", "outDir": "./dist/config"}]. Read more here.

// https://docs.nestjs.com/cli/monorepo#assets