import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from 'axios';
import Spinner from '../../components/Spinner/Spinner'
import Card from '../../components/Card/Card'

const Routines = () => {
    const { user } = useContext(AuthContext)

    async function getRoutines(){
        try{
            const { data } = await axios.get(`http://localhost:5000/api/routines/${user._id}`)
            return data
        }catch(err){
            console.log(err)
            throw err
        }
    }
    
    const { isLoading,data, error } = useQuery({
        queryKey: ['routines'],
        queryFn: getRoutines
    })
    async function deleteItem(id){
        try{
            await axios.delete(`http://localhost:5000/api/routines/${id}`)
        }
        catch(err){
            throw err
        }
    }

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn:(id)=>deleteItem(id),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ['routines']
            })
            queryClient.invalidateQueries({
                queryKey: ['entries']
            })
        },
        onError:(err)=>{
            console.log(err)
        }
    })

    if(isLoading) return <div className='viewscreen' style={{display:'flex', justifyContent:'center',padding:'100px 0px'}}>
        <Spinner color='darkred' size={30} />
    </div>
    if(error) return <div className='viewscreen'><p>{error.message}</p></div>
    else return (
        <div className="viewContainer viewscreen">
            {
                data.length === 0 ? 
                <div className="alert-info">Your routines list is empty</div>
                :data?.map((r, index) => (
                    <Card
                        key={index}
                        link={r.link}
                        name={r.name}
                        workout_type={r.workout_type}
                        body_part={r.body_part}
                        element={<button onClick={()=>mutate(r._id)} className='delButton'>Delete</button>}
                    />
                ))
            }
        </div>
    )
}

export default Routines