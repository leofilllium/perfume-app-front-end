import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/Main/MainPage";
import Header from "./components/Header/Header";
import About from "./pages/About/About";
import Footer from "./components/Footer/Footer";
import Shop from "./pages/Shop/Shop";
import AuthPage from "./pages/Auth/AuthPage";
import Profile from "./pages/Profile/Profile";
import QuizPage from "./pages/Quiz/QuizPage";
import ForYouPage from "./pages/ForYou/ForYouPage";
import PerfumeDetailsPage from "./pages/PerfumeDetails/PerfumeDetailsPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/perfume/:id" element={<PerfumeDetailsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/for-you" element={<ForYouPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
