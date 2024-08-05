import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios";
import Card from '../../components/Card/Card'
import AwesomeCarousel from '../../components/Carousel/Carousel'
import Entry from '../../components/Entry/Entry'
import Spinner from '../../components/Spinner/Spinner'
import './user.css'

export default function User(){
    const {id} = useParams()

    const [info,setInfo] = useState({})
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        async function fetchUser(){
            setLoading(true)
            const {data} = await axios.get(`http://localhost:5000/api/users/${id}`)
            setInfo(data)
            setLoading(false)
        }
        fetchUser()
    },[id])

    return (<>
        <div className="container">
            { loading ? <div className='viewscreen' style={{display:'flex', justifyContent:'center',padding:'100px 0px'}}>
                <Spinner color='darkred' size={30} />
            </div> : <>
            <div className="userCard">
                <img src={info.profilePicture ||  window.location.origin+"/no-avatar.gif"} alt="" className="useImg" />
                <h2>{info.username}</h2>
                <h3>{info.email}</h3>
            </div>
            { info.meals && <div className="marginv">
                <h1>About Meals</h1>
                {info.meals.length === 0 ? 
                    <div className="alert-info">Meals list is empty</div>
                : <AwesomeCarousel>
                    {
                        info.meals.map((m, index) => (
                            <Card
                                key={index}
                                link={m.recipe}
                                name={m.name}
                                description={m.description}
                                time={m.time}
                                category={m.category}
                            />
                        ))
                    }
                </AwesomeCarousel>}
            </div> }
            { info.routines && <div className="marginv">
                <h1>About Routines</h1>
                {info.routines.length === 0 ? 
                    <div className="alert-info">Routines list is empty</div>
                :<AwesomeCarousel>
                    {
                        info.routines.map((r, index) => (
                            <Card
                                key={index}
                                link={r.link}
                                name={r.name}
                                workout_type={r.workout_type}
                                body_part={r.body_part}
                            />
                        ))
                    }
                </AwesomeCarousel>}
            </div> }
            { info.entries && <div className="marginv">
                <h1>About Entries</h1>
                {info.entries.length === 0 ? 
                    <div className="alert-info">Entries list is empty</div>
                :<AwesomeCarousel>
                    {
                        info.entries.map((d, index) => (
                            <Entry
                                key={index}
                                date={d.date}
                                meals={d.meals}
                                routines={d.routines}
                            />
                        ))
                    }
                </AwesomeCarousel>}
            </div> }
            </>
            }
        </div>
    </>)
}