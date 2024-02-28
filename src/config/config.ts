import { MongooseModuleOptions } from '@nestjs/mongoose';

const mongooseConfig: MongooseModuleOptions = {uri: "mongodb+srv://admin:WhiteMagic@mycluster.kbteo6o.mongodb.net/nestjs-blog-app?retryWrites=true&w=majority"};
export default mongooseConfig;