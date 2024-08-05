import React from "react";
import "./login.css";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Spinner from '../../components/Spinner/Spinner'

function Login() {
    const [credentials, setCredentials] = useState({
        email: undefined,
        password: undefined,
    });

    const { dispatch,error,loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async () => {
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", credentials);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate('/home');
        } catch (err) {
            if (err.response && err.response.data) {
                dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
            } else {
                dispatch({ type: "LOGIN_FAILURE", payload: "An error occurred while logging in" });
            }
        }
    };


    return (
        <div className="loginCard">
            <div className="center">
                <h1>Welcome Back!</h1>
                <form>
                    <div className="txt_field">
                        <input
                            type="text"
                            placeholder="email"
                            id="email"
                            onChange={handleChange}
                            className="lInput"
                        />
                    </div>
                    <div className="txt_field">
                        <input
                            type="password"
                            placeholder="password"
                            id="password"
                            onChange={handleChange}
                            className="lInput"
                        />
                    </div>
                    {error && <div className="alert-danger">{error?.message}</div>}
                    <div className="login_button">
                        <button className="button" disabled={loading} onClick={handleClick}>
                            {loading ? <Spinner color='white' size={30} /> : 'Login'}
                        </button>
                    </div>
                    <div className="signup_link">
                        <p>
                            Not registered? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;