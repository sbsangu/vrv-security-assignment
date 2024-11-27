import mongoose from 'mongoose';
import config from './serverConfig';

async function connectToDb(): Promise<void> {
  try {
   
      await mongoose.connect(config.MONGO_URI as string);
      console.log('Connected to database');
    
  } catch (error) {
    console.error('Error in connecting to database');
    console.error(error);
  }
}

export default connectToDb;
