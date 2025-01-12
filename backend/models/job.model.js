 import mongoose from "mongoose";
//  JobSchema: Defines how the data is structured and validated in the database.
// You have a rulebook (JobSchema) for how jobs must be stored in the database.
// A job must have a title, description, and salary.
// Salary should be a number.
// The company posting the job must be linked.

 const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    requirements:[{
        type: String,
    }],
    salary:{
        type: Number,
        required: true,
    },
    experienceLevel:{
        type:Number,
        required:true,
    },
    location:{
        type: String,
        required: true,
    },
    jobType:{
        type: String,
        required: true,
    },
    position:{
        type: Number,
        required: true,
    },
    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    applications:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
 }, {timestamps:true});
 export const Job = mongoose.model("Job" , jobSchema);