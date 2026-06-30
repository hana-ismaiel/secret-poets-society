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
import ThemeDetailPage from "./pages/ThemeDetailPage"
import SearchPage from "./pages/SearchPage"
import PopularPage from "./pages/PopularPage"
import AiGenerationPage from "./pages/AiGenerationPage"

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
            <Route path="/users/:username/:tab?" element={<UserPage />} />
            <Route path="/following" element={<FollowingPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/themes/:pathname" element={<ThemeDetailPage />} /> 
            <Route path="/popular" element={<PopularPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/ai-generation" element={<AiGenerationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App