import React, { useContext } from 'react'
import "./landing.css"
import { AuthContext } from '../../context/authContext'
import { Link } from "react-router-dom"

const Landing = () => {

    const { user } = useContext(AuthContext)

    return (
        <>
            <div className="upper-layer">
                <h1>Welcome to <span className='brand-name'>WorkoutPlanner</span></h1>
                <Link to={user ? '/home' : '/login'}>
                    <button className='btn-get-started'>Get Started</button>
                </Link>
            </div>
        </>
    )
}

export default Landing