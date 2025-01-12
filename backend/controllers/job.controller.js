import { Job } from "../models/job.model.js";

// Scenario: The recruiter enters details like:

// Job Title: Software Engineer
// Description: Develop and maintain software applications.
// Salary: 7000
// Location: Remote
// Job Type: Full-Time
// Experience Level: 2 years
// Company: TechCorp
// When they click "Submit," the data is sent from their browser to your server in the request body (req.body).


// admin post job
export const postJob = async (req, res) => {
    try {
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"Something is missing",
                success: false
            })
        };

        // Job.create()
// This method is provided by Mongoose.
// It creates a new document (an entry) in the database based on the schema (JobSchema) you've defined.
// It uses the extracted and validated data to ensure it matches the structure of the schema.

        const job = await Job.create({
            
            title, 
            description, 
            requirements:requirements.split(","), 
            salary:Number(salary), 
            location, 
            jobType, 
            experienceLevel:experience, 
            position, 
            company:companyId,
            created_by:userId,
        });
        return res.status(201).json({
            message:"New job created successfully",
            success:true,
        })
    } catch (error) {
     console.log(error);
        
    }
}
   // for student
export const getAllJobs = async (req,res) => {
    try {
        const keyword = req.query.keyword || "" ; 
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success:false,
            })
        };
        return res.status(200).json({
            jobs,
            success:true,
        })
    } catch (error) {
        console.log(error);
        
    }
}

// for student

export const getJobById = async(req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
    });
        if(!job){
            return res.status(404).json({
                message:"Jobs not found..",
                success:false,
            })
        }
        return res.status(200).json({
            job,
            success:true,
        })
     } catch (error) {
        console.log(error);
        
    }
}

// admin kitne job create kra h abhi tak

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}