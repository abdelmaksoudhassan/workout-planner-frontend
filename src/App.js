import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './layout/Layout'
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Entries from "./pages/Entry/Entries";
import Routines from "./pages/Routine/Routines"
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import Home from "./pages/Home/Home";
import Meal from "./pages/Meal/Meal";
import Profile from './pages/Profile/Profile'
import User from "./pages/User/User";
import Error from "./pages/Error/Error";

function App() {
    const { user } = useContext(AuthContext);

    const ProtectedRoute = ({ children }) => {
        if (!user) {
            return <Login title="Login to Create" />;
        } else {
            return children;
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"  element={<Landing />} />
                <Route path="/" element={<Layout/>}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/users/:id" element={<ProtectedRoute><User /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/entries" element={<ProtectedRoute><Entries /></ProtectedRoute>} />
                    <Route path="/meals" element={<ProtectedRoute><Meal /></ProtectedRoute>} />
                    <Route path="/routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
                </Route>
                <Route path="*"  element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;