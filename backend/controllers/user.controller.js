import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    };
    const file = req.file;
    // const fileUri = getDataUri(file);   //1
    // const cloudResponse = await cloudinary.uploader.upload(fileUri.content); //2

    let cloudResponse;
    if(file){
      try {
        const fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      } catch (error) {
        console.error("Cloudinary uplooad error" , error.message);
        return res.status(500).json({
          message: "Failed to upload file",
          success: false,
        })
      }
    };
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist...",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile:{
        profilePhoto: cloudResponse.secure_url,
      }
    });

    return res.status(201).json({
      message: "Accounte created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User already exist...",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password...",
        success: false,
      });
    }
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const tokenData = {
      //it is a data which is added into token..
      userId: user._id,
    };
    // jwt.sign create the actual token (ID card) by signing the tokenData with a secret key.
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // The original user object might contain additional fields that are not needed on the client side. Sending unnecessary data:

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    // "token" --> A cookie named "token" is being set in the response, and the JWT (token) is stored in this cookie.

    // maxAge --> Sets the lifespan of the cookie to 1 day (1 * 24 * 60 * 60 * 1000 milliseconds). After 1 day, the cookie will expire automatically.

    // httpsOnly -->  Makes the cookie inaccessible to JavaScript on the client side. This is a security measure to protect the token from being stolen via client-side attacks (e.g., XSS).

    // sameSite: 'strict' --> Restricts the cookie from being sent with cross-site requests, reducing the risk of Cross-Site Request Forgery (CSRF) attacks.

    // token help to tell that it is correct person which is entering in page

    // now cookie help to tell that user is still login

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// When you log out, the server removes the token that proves you're logged in.
// The token was stored in a cookie.
// Now, the server tells your browser:
// "Clear the cookie so the token is gone!"

// here it mean that - token is gone tell that user id and etc are not their so we have to delete cookie also

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    // console.log(fullname, email, phoneNumber, bio, skills);
    
    const file = req.file;
    // const fileUri = getDataUri(file);   //1
    // const cloudResponse = await cloudinary.uploader.upload(fileUri.content); //2

    let cloudResponse;
    if(file){
      try {
        const fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      } catch (error) {
        console.error("Cloudinary uplooad error" , error.message);
        return res.status(500).json({
          message: "Failed to upload file",
          success: false,
        })
      }
    }

    // cloudinary comes here....

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; //logged in user id
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // resume here
    if(cloudResponse) {
      user.profile.resume = cloudResponse.secure_url  //save the cloudinary url
      user.profile.resumeOriginalName = file.originalname  //save the original file name
    }
    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
