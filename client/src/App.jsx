import { Routes, Route } from "react-router-dom"
import NotFoundPage from "./pages/NotFoundPage"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import PoemPage from "./pages/PoemPage"
import UserPage from "./pages/UserPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/poems/:id" element={<PoemPage />} />
        <Route path="/users/:username" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App