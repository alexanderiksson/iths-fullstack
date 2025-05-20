import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import NewPost from "./pages/NewPost";
import User from "./pages/User";

function App() {
    return (
        <Router>
            <UserProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/new-post" element={<NewPost />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/u/:id" element={<User />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </UserProvider>
        </Router>
    );
}

export default App;
