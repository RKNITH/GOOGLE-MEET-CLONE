import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ;

if(!MONGODB_URI){
   throw new Error('please define MONGODB_URI in your environment variable for databse connection')
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise:null};
}

async function dbConnect () {
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){

        const object = {
            bufferCommands:false,
            serverSelectionTimeoutMS:5000
        }

        //create a new connection and return promise and store in the cahce object
        cached.promise = mongoose.connect(MONGODB_URI, object).then((mongoose) => {
            return mongoose;
        })
    }
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise=null
        throw error;
    }

    return cached.conn
}

export default dbConnect;