import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import NewPost from "./pages/NewPost";
import User from "./pages/User";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/new-post" element={<NewPost />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/u/:id" element={<User />} />
                    </Route>
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
