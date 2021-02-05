const mogoose = require('mongoose');
const config = require('config');
const dbConnString = config.get('mongoDBConnString');

const connectDB = async () =>{
    try{
        await mogoose.connect(dbConnString,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }
            ,()=>{
            console.log('Mongo DB connected');
        })
       
    }
    catch(e){
        console.error(e.message);
        process.exit(1);
    }
}

module.exports = connectDB;