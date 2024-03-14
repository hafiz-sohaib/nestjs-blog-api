import { MongooseModuleOptions } from '@nestjs/mongoose';
import { globalConstants } from './constants';

const mongooseConfig: MongooseModuleOptions = {uri: globalConstants.databaseUrl};
export default mongooseConfig;