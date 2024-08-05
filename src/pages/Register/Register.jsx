import React from "react";
import "./register.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import axios from "axios";
import Spinner from '../../components/Spinner/Spinner'

function Register() {
    const navigate = useNavigate();
    const {register,handleSubmit,formState} = useForm()
    const [loading,setLoading] = useState(false)

    const {errors} = formState
    const emailRegExp = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm
    
    function onError(errors){
        console.log(errors)
    }

    const [file, setFile] = useState("");

    const onSubmit = async (info) => {

        if (file) {
            const data = new FormData();

            data.append("file", file);
            data.append("upload_preset", "p8g9pgti");

            try {
                setLoading(true)
                const uploadRes = await axios.post(
                    "https://api.cloudinary.com/v1_1/devjdwk5e/image/upload",
                    data, { withcredentials: false }
                );

                const { url } = uploadRes.data;

                const newUser = {
                    ...info,
                    profilePicture: url,
                };

                await axios.post("http://localhost:5000/api/auth/register", newUser, { withcredentials: false })

                navigate("/login");
            } catch (err) {
                setLoading(false)
                console.log(err);
            }
        } else {
            try {
                setLoading(true)
                await axios.post("http://localhost:5000/api/auth/register", info, { withcredentials: false })

                navigate("/login");
            } catch (err) {
                setLoading(false)
                console.log(err)
            }
        }
    };

    return (
        <div className="registerCard">
            <div className="center">
                <h1>Join Us</h1>

                <form onSubmit={handleSubmit(onSubmit,onError)}>
                    <div className="image">
                        <img
                            src={file? URL.createObjectURL(file):"no-image-icon-0.jpg"}
                            alt=""
                            height="100px"
                            width="100px"
                        />

                        <div className="txt_field_img">
                            <label htmlFor="file" style={{cursor: 'pointer'}}>
                                Image (optional)
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>

                    <div className="formInput">


                        <div className="txt_field">
                            <input
                                type="text"
                                placeholder="username"
                                {...register('username',{
                                    required: 'field is required',
                                    minLength:{
                                        value: 4,
                                        message: 'min length is 4'
                                    }
                                })}
                            />
                        </div>
                        <div className="txt_field">
                            <input
                                type="text"
                                placeholder="email"
                                {...register('email',{
                                    required: 'field is required',
                                    validate:(val)=>emailRegExp.test(val) || 'invalid email'
                                })}
                            />
                        </div>
                        <div className="txt_field">
                            <input
                                type="password"
                                placeholder="password"
                                {...register('password',{
                                    required: 'field is required',
                                    minLength:{
                                        value: 6,
                                        message: 'min length is 6'
                                    }
                                })}
                            />
                        </div>
                    </div>
                    {Object.keys(errors).length !==0 && <div className="alert-danger">
                        {Object.keys(errors).map((keyName, i) => (
                            <li key={i}>
                                <span>{keyName}: {errors[keyName].message}</span>
                            </li>
                        ))}
                    </div>}
                    <div className="login_button">
                        <button className="button" type="submit">
                            {loading ? <Spinner color='white' size={25} /> : 'Register'}
                        </button>
                    </div>
                    <div className="signup_link">
                        <p>
                            Already Registered? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;