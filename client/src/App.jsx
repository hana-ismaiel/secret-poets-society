import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import HomePage from "./pages/HomePage"
import PoemPage from "./pages/PoemPage"
import UserPage from "./pages/UserPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import NotFoundPage from "./pages/NotFoundPage"
import CreatePoemPage from "./pages/CreatePoemPage"
import EditPoemPage from "./pages/EditPoemPage"
import FollowingPage from "./pages/FollowingPage"
import ThemesPage from "./pages/ThemesPage"

function App() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/poems/create" element={<CreatePoemPage />} />
            <Route path="/poems/edit/:id" element={<EditPoemPage />} />
            <Route path="/poems/:id" element={<PoemPage />} />
            <Route path="/users/:id" element={<UserPage />} />
            <Route path="/following" element={<FollowingPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App