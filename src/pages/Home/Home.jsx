import React, { useContext } from 'react'
import "./home.css"
import HomeComp from '../../components/HomeComp/HomeComp'
import { AuthContext } from '../../context/authContext'


const Home = () => {
    const {user} = useContext(AuthContext)
    return (
        <div className='home'>
            <div className="banner">
                <h1>Welcome {user.username} to WorkoutPlanner</h1>
                <p>The one stop solution for your fitness journey</p>
            </div>
            <div className="mainContainer">
                <HomeComp
                    image="planner.png"
                    name="Entries"
                    description="Keep track of your daily progress"
                    view="/entries"
                />
                <HomeComp
                    image="routine.png"
                    name="Routines"
                    description="Add personalized routines"
                    view="/routines"
                />
                <HomeComp
                    image="meal.png"
                    name="Meals"
                    description="Add personalized meals"
                    view="/meals"
                />

            </div>

        </div>
    )
}

export default Home