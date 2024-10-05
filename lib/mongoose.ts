import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async ()=>{
    mongoose.set('strictQuery',true);

    if(!process.env.MONGODB_URL) return console.log('MONGO URL NOT FOUND');

    if(isConnected) return console.log('Already connected to Mongo DB');

    try {
        await mongoose.connect(process.env.MONGODB_URL);

        isConnected = true;

        console.log('connected to mongodb',isConnected);
        
    } catch (error) {
        console.log(error,'mongo error');
        
    }
    
    
}