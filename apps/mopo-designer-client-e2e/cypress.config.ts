import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run mopo-designer-client:serve:development',
        production: 'nx run mopo-designer-client:serve:production',
      },
      ciWebServerCommand: 'nx run mopo-designer-client:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
