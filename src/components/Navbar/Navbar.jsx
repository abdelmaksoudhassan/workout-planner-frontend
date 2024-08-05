import './navbar.css'
import { useContext } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom"
import { AuthContext } from "../../context/authContext"


const Navbar = () => {

    const { user, dispatch } = useContext(AuthContext)
    const handleClick = async () => {
        dispatch({ type: "LOGOUT" });
    }

    return (
        <div className='navContainer'>
            <Link to="/">
                <p className='navLogo'>WorkoutPlanner</p>
            </Link>

            <label htmlFor="menu-bar">
                <FontAwesomeIcon icon={faBars} className="icon" />
            </label>
            <input type="checkbox" id='menu-bar' />
            
            <nav className='navbar'>
                <ul>
                    {user ? (<>
                        <li>
                            <NavLink to="/home">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>
                        <li>
                            <NavLink to="/routines">Routine</NavLink>
                        </li>
                        <li>
                            <NavLink to="/meals">Meal</NavLink>
                        </li>
                        <li>
                            <NavLink to="/entries">Entries</NavLink>
                        </li>
                        <li onClick={handleClick} >
                            <NavLink to='/login'>Logout</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/users/${user._id}`}>
                                    <div>
                                        <img src={user.profilePicture ||  window.location.origin+"/no-avatar.gif"} alt="" />
                                        <span>{user.username}</span>
                                    </div>
                            </NavLink>
                        </li>
                    </>
                    ):(
                        <>
                            <li><NavLink to="/register">
                                Register
                            </NavLink></li>
                            <li><NavLink to="/login">
                                Login
                            </NavLink></li>
                        </>
                    )}
                </ul>
            </nav>
        </div >
    )
}

export default Navbar