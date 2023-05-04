import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    lists,
    session,
    server: {
      port: 3002,
      cors: {
        origin: [`${process.env.CORS_URL || 'http://localhost:3000'}`],
        credentials: true
      }
    },
    storage: {
      dpStorage: {
        type: 'image',
        kind: 'local',
        generateUrl: path => (process.env.URL || 'http://localhost:3002/images/') + path,
        serverRoute: {
          path: '/images'
        },
        storagePath: 'public/images'
      }
    }
  })
);
