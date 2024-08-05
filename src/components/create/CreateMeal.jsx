import './popUp.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react';
import axios from "axios"
import { AuthContext } from '../../context/authContext';
import { category } from '../../data/data';

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

const CreateMeal = ({ setOpen }) => {

    const { user } = useContext(AuthContext);

    const handleClick = async (vals) => {
        const newMeal = {
            ...vals, author: user._id
        }
        try {
            await axios.post("http://localhost:5000/api/meals", newMeal, {
                withCredentials: false
            })
            setOpen(false)
        }
        catch (err) {
            alert('internal server error, details in console')
            console.log(err)
        }
    }

    const queryClient = useQueryClient()

    const {register,handleSubmit,reset,formState} = useForm()

    const {isLoading,mutate} = useMutation({
        mutationFn:handleClick,
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey: ['meals']})
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

                <div className="mTitle">Add Meal</div>

                <form onSubmit={handleSubmit(onSubmit,onError)}>
                    <input
                        className="formInput"
                        type="text"
                        placeholder='Enter your Meal name'
                        {...register('name',{
                            required: 'field is required',
                            minLength:{
                                value: 4,
                                message: 'min length is 4'
                            }
                        })}
                    />
                    <textarea
                        name="Description"
                        id='description'
                        cols="30"
                        rows="1"
                        placeholder='Add meal details'
                        {...register('description',{
                            required: 'field is required',
                            minLength:{
                                value: 5,
                                message: 'min length is 5'
                            }
                        })}>
                    </textarea>
                    <input
                        className="formInput"
                        type="text"
                        {...register('recipe')}
                        placeholder='Recipe links (optional)'
                    />
                    <input
                        className="formInput"
                        type="number"
                        placeholder='Enter time in minutes'
                        {...register('time',{
                            required: 'field is required',
                            min:{
                                value: 1,
                                message: 'min length is 1'
                            }
                        })}
                    />
                    <div className="formInput" id='options'>
                        <label>Choose Category</label>
                        <select
                            {...register('category',{
                                validate:(val)=>val !=='none' || 'field is required'
                            })}
                        >
                            <option key={0} value="none">-</option>
                            {
                                category.map((c, index) => (

                                    <option key={index} value={c}>{c}</option>
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

export default CreateMeal