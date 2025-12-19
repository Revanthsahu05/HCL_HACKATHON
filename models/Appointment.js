import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required:true,
    minlength:[3,"First name must contain atleast three characters!"],
  },
  lastName:{
    type: String,
    required:true,
    minlength:[3,"Last name must contain atleast three characters!"],
  },
  email:{
    type: String,
    required:true,
    validate: [validator.isEmail,"Please provide a valid Email address"],
  },
  phone:{
    type: String,
    required:true,
    minlength:[10,"Phone number must contain 10 digits!"],
    maxlength:[10,"Phone number must contain 10 digits!"],
  },
  nic: {
    type: String,
    required:true,
    minlength:[12,"NIC must contain 12 digits!"],
    maxlength:[12,"NIC must contain 12 digits!"],
  },
  dob:{
    type: String,
    required:[true, "DOB is required!"],
  },
  gender:{
    type: String,
    required:true,
    enum: ["Male", "Female"],
  },
  password:{
    type: String,
    required:true,
    minlength:[8,"Password must contain atleast 8 characters!"],
    select: false,
  }, 
  role:{
    type: String,
    required:true,
    enum: ["Admin", "Patient", "Doctor"],
  }, 

  doctorDepartment: {
    type: String,
  },
  doctorAvatar: {
    public_id: String,
    url: String,
  },
});

  adminSchema.pre("save", async function(next){
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
    };
     
    adminSchema.methods.generateJsonWebToken = function() {
  return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
    };

export const Admin = mongoose.model("Admin", adminSchema);