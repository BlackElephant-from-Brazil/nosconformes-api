import { DATA_SOURCE } from '../config/constants';
import { dataSource } from './ormDataSource';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
