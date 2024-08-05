import './popUp.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react';
import axios from "axios"
import { AuthContext } from '../../context/authContext.js';
import { WorkoutType, BodyPart } from "../../data/data.js"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

const CreateRoutine = ({ setOpen }) => {

    const { user } = useContext(AuthContext);

    const handleClick = async (vals) => {

        const newRoutine = {
            ...vals, author: user._id
        }
        try {
            await axios.post("http://localhost:5000/api/routines", newRoutine, {
                withCredentials: false
            })
            setOpen(false)
        }
        catch (err) {
            alert('internal server error, details in console')
            console.log(err)
        }
    }
    const {register,handleSubmit,reset,formState} = useForm()
    const queryClient = useQueryClient()
    const {isLoading,mutate} = useMutation({
        mutationFn:handleClick,
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey: ['routines']})
            reset()
        },
        onError:(err)=>{ console.log(err) }
    })
    const {errors} = formState
    const onError = (err)=>{ console.log(err) }
    const onSubmit = (vals) => mutate(vals)

    return (
        <div className="modal">
            <div className="mContainer">

                <FontAwesomeIcon icon={faXmark} className="mClose" onClick={() => setOpen(false)} />

                <div className="mTitle">Create Routine</div>

                <form onSubmit={handleSubmit(onSubmit,onError)}>
                    <input
                        className="formInput"
                        type="text"
                        placeholder='Enter the Workout Name'
                        {...register('name',{
                            required: 'field is required',
                            minLength:{
                                value: 4,
                                message: 'min length is 4'
                            }
                        })}
                    />
                    <input
                        className="formInput"
                        type="text"
                        {...register('link')}
                        placeholder='Workout link (optinal)'
                    />

                    <div className="formInput" id='options'>
                        <label>Choose Workout Type</label>
                        <select {...register('workout_type',{
                            validate:(val)=>val !=='none' || 'field is required'
                        })}>
                            <option key={0} value="none">-</option>
                            {
                                WorkoutType.map((w, index) => (

                                    <option key={index} value={w}>{w}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="formInput" id='options'>
                        <label>Choose Body Part</label>
                        <select {...register('body_part',{
                            validate:(val)=>val !=='none' || 'field is required'
                        })}>
                            <option key={0} value="none">-</option>
                            {
                                BodyPart.map((b, index) => (

                                    <option key={index} value={b}>{b}</option>
                                ))
                            }
                        </select>
                    </div>
                    {Object.keys(errors).length !==0 && <div className="alert-danger">
                        {Object.keys(errors).map((keyName, i) => (
                            <div key={i}>
                                <span>* {keyName}: {errors[keyName].message}</span>
                            </div>
                        ))}
                    </div>}
                    <button className="mButton" type='submit' disabled={isLoading}>
                        {isLoading ? 'Loading' : 'Submit' }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateRoutine