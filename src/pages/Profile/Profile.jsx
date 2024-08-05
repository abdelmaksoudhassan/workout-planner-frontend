import './profile.css'
import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import axios from "axios";
import { AuthContext } from '../../context/authContext';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Spinner from '../../components/Spinner/Spinner'

export function UpdateAccountForm(){

    const emailRegExp = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm
    const { user,dispatch,loading } = useContext(AuthContext); 
    const [file, setFile] = useState();
    const queryClient = useQueryClient()
    const {register,handleSubmit,formState} = useForm({
        defaultValues: {username: user.username,email:user.email}
    })

    const updateInfo = async (info) => {
        dispatch({type:'UPDATE_USER_START'})
        if (file) {
            const data = new FormData();

            data.append("file", file);
            data.append("upload_preset", "p8g9pgti");

            try {
                const uploadRes = await axios.post(
                    "https://api.cloudinary.com/v1_1/devjdwk5e/image/upload",
                    data, { withcredentials: false }
                );

                const { url } = uploadRes.data;

                const newUser = {
                    ...info,
                    profilePicture: url,
                };

                await axios.put(`http://localhost:5000/api/users/${user._id}`, newUser, { withcredentials: false })
                dispatch({ type: "UPDATE_USER_SUCCESS", payload: newUser });
            } catch (err) {
                if (err.response && err.response.data) {
                    dispatch({ type: "UPDATE_USER_FAILURE", payload: err.response.data });
                } else {
                    dispatch({ type: "UPDATE_USER_FAILURE", payload: "An error occurred while updating" });
                }
            }
        } else {
            try {
                await axios.put(`http://localhost:5000/api/users/${user._id}`, info, { withcredentials: false })
                dispatch({ type: "UPDATE_USER_SUCCESS", payload: info });
            } catch (err) {
                if (err.response && err.response.data) {
                    dispatch({ type: "UPDATE_USER_FAILURE", payload: err.response.data });
                } else {
                    dispatch({ type: "UPDATE_USER_FAILURE", payload: "An error occurred while updating" });
                }
            }
        }
    };
    
    const {mutate} = useMutation({
        mutationFn:updateInfo,
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ['users']
            })
        },
        onError:(err)=>{
            console.log('err')
        }
    })

    const {errors} = formState

    const onSubmit = (info) => mutate(info)

    function onError(errors){
        console.log(errors)
    }

    return(<>
    <div className="register">
        <div className="updateCard">
            <div className="center">
                <h1>Update profile</h1>
                    <form onSubmit={handleSubmit(onSubmit,onError)}>
                        <div className="image">
                            <img
                                src={user.profilePicture && file==null ?
                                     user.profilePicture: file? URL.createObjectURL(file) :
                                     "no-image-icon-0.jpg"}
                                alt=""
                                height="100px"
                                width="100px"
                            />
                            <div>
                                <label htmlFor="file" style={{cursor: 'pointer'}}>
                                    Change Image
                                </label>
                                <input
                                    className="txt_field_img"
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="txt_field">
                                <input
                                    className="lInput"
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
                                    className="lInput"
                                    type="text"
                                    placeholder="email"
                                    {...register('email',{
                                        required: 'field is required',
                                        validate:(val)=>emailRegExp.test(val) || 'invalid email'
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
                        <div className="login_button" style={{margin:'20px 0px'}}>
                            <button className="button" type="submit" disabled={loading}>
                                {loading ? <Spinner color='white' size={25} /> : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>)
}

export function DataGrid({isLoading,error,data,user}){
    if(isLoading){
        return <div style={{display:'flex', justifyContent:'center'}}>
            <Spinner color='darkred' size={30} />
        </div>
    }else{
        return error ? <p>{error?.message}</p> : 
        <div style={{overflowX:'auto',margin: '20px 0px'}}>
            <table>
            <thead>
                <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>#</th>
                </tr>
            </thead>
            <tbody>
            { data.map((item,idx)=>(<tr key={idx}>
                <td>
                    <img
                        src={item.profilePicture? item.profilePicture : "no-avatar.gif"}
                        alt=""
                        height="50px"
                        width="50px"
                        style={{borderRadius:'50%'}}
                    />
                </td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{ item._id === user._id ? <span>You</span> : <Link to={`/users/${item._id}`}>Visit profile</Link>}</td>
            </tr>))}
            </tbody>
        </table>
    </div>
    }
}
export default function Profile(){
    const { user,dispatch } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false)
    const handleDeleteAccount = () => {
        setDeleting(true)
        axios.delete(`http://localhost:5000/api/users/${user._id}`).then(()=>{
            dispatch({type: 'LOGOUT'})
            navigate('/')
            setDeleting(false)
        }).catch(err=>{
            alert('internal server error')
            console.log(err)
            setDeleting(false)
        })
    }
    const getUsers = async() => {
        try{
            const {data} = await axios.get('http://localhost:5000/api/users')
            return data
        }catch(err){
            throw err
        }
    }
    const { isLoading,data: users, error } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers
    })

    return (
        <>
            <UpdateAccountForm />
            <div className='container'>
                <div className='delBtnRow'>
                    <span>Delete my account : </span>
                    <button onClick={handleDeleteAccount} className='delButton'>
                        {deleting ? <Spinner color='white' size={15} /> : 'Delete'}
                    </button>
                </div>
                <h2>discover users :</h2>
                <DataGrid isLoading={isLoading} user={user} data={users} error={error} />
            </div>
        </>
    )
}