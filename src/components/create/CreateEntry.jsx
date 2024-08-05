import './popUp.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react';
import axios from "axios"
import useFetch from '../../hooks/useFetch';
import { AuthContext } from '../../context/authContext';

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

const CreateEntry = ({ setOpen }) => {

    const { user } = useContext(AuthContext);
    const { data } = useFetch(`http://localhost:5000/api/entries/fetchMealsAndRoutines/${user._id}`)
    const handleClick = async (vals) => {
        const newEntry = {
            ...vals, author: user._id
        }
        try {
            await axios.post('http://localhost:5000/api/entries/', newEntry, {
                withCredentials: false
            })
            setOpen(false)
        }
        catch (err) {
            alert('internal server error, details in console')
            console.error(err)
        }
    }

    const {register,handleSubmit,reset,formState} = useForm()

    const queryClient = useQueryClient()

    const {isLoading,mutate} = useMutation({
        mutationFn:handleClick,
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey: ['entries']})
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

                <div className="mTitle">Create Entry</div>

                <form onSubmit={handleSubmit(onSubmit,onError)}>
                    <input
                        className="formInput"
                        type="date"
                        {...register('date',{
                            required: 'field is required'
                        })}
                    />

                    <div className="formInput" id='options'>
                        <label>Choose Meals</label>
                        <select
                            multiple
                            {...register('meals',{
                                validate:(val)=>val.length !== 0 || 'field is required'
                            })}
                        >
                            {data?.meals?.map((meal, index) => (
                                <option key={index} value={meal._id}>{meal.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="formInput" id='options'>
                        <label>Choose Routines</label>
                        <select
                            multiple
                            {...register('routines',{
                                validate:(val)=>val.length !== 0 || 'field is required'
                            })}
                        >
                            {data?.routines?.map((routine, index) => (
                                <option key={index} value={routine._id}>{routine.name}</option>
                            ))}
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

export default CreateEntry