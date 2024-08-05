import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Card from '../../components/Card/Card'
import Spinner from '../../components/Spinner/Spinner'

const Meal = () => {
    const { user } = useContext(AuthContext)
    async function getMeals(){
        try{
            const { data } = await axios.get(`http://localhost:5000/api/meals/${user._id}`)
            return data
        }catch(err){
            throw err
        }
    }
    
    const { isLoading,data, error } = useQuery({
        queryKey: ['meals'],
        queryFn: getMeals
    })
    async function deleteItem(id){
        try{
            await axios.delete(`http://localhost:5000/api/meals/${id}`)
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
                queryKey: ['meals']
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
    else return (<>
        <div className="viewContainer viewscreen">
            { data.length === 0 ? 
                <div className="alert-info">Your meals list is empty</div>
                :data?.map((m, index) => (
                    <Card
                        key={index}
                        link={m.recipe}
                        name={m.name}
                        description={m.description}
                        time={m.time}
                        category={m.category}
                        element={<button onClick={()=>mutate(m._id)} className='delButton'>Delete</button>}
                    />
                ))
            }
        </div>
    </>)
}

export default Meal