import React, { useEffect } from 'react'
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { Label } from '@radix-ui/react-label';
import { Input } from '../input';
import { RadioGroup } from '../radio-group';
import { Button } from '../button';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const {loading, user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: "",
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    // formData is an envelop created with the help of FormData().
    //  in envelop keys and values both are put inside it, key is fullname,email, etc and values are input we put like isAsyncThunkAction.
    //  and on envelop we write only keys(fullname,email,phoneNumber).
    //formData.append() is a method used to add a key-value pair to the FormData object or the envelope
    // and in const res, we write formData , it means that envelop is going to backend with the help of api
    // Yes, exactly! When you pass formData in the const res with axios.post(), it means the envelope (containing the keys and values) is being sent to the backend via the API. The formData is sent as part of the request, allowing the server to process the form data, including any files, in the backend.
    //     A header in the context of HTTP requests and responses is a key-value pair that provides additional information about the request or response.
    // Headers help the server understand how to interpret the incoming request. Specifically, in the case of sending FormData, the Content-Type header is important.
    //     Content-Type tells the server what kind of data is being sent.
    // For FormData, the Content-Type is multipart/form-data, which indicates that the request contains files and form data in multiple parts.
    // This allows the server to properly handle the request, separating text data (like full name and email) from file data (like a profile picture).

    // Yes, exactly! withCredentials: true ensures that important information, such as cookies, authentication tokens, or session data, is sent along with the request to the backend, especially for cross-origin requests. This is necessary when the backend requires those credentials for user authentication or session management.


    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            })
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);

        } finally{
            dispatch(setLoading(false));
        }

    }
 useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>SignUp</h1>

                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="pal" />
                    </div>

                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="pal@gmail.com" />

                    </div>

                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="9870999684" />



                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="pal@gmail.com" />
                    </div>

                    <div className='flex items-center justify-between'>
                        <RadioGroup className='flex items-center gap-4 my-3'>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer' />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer' />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className='cursor-pointer'
                            />

                        </div>
                    </div>
                    {
                            loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait.. </Button>  :  <Button type="submit" className="w-full my-4 bg-black text-white hover:bg-red-600  ">SignUp</Button>
                            }
                   
                    <span className='text-sm'>Alreadt have an account? <Link to="/login" className='text-red-700'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup;
