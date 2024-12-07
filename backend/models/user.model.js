import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
   username:{
    type:String,
    required:true,
    unique:true
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   password:{
    type:String,
    required:true,
    
   } 
},{timestamps:true});//timestamp will give extra information when was user created and updated to model will later on help in sorting user based on the time

const User=mongoose.model('User',userSchema);

export default User;