import Navbar from "../components/layout/Navbar.jsx";
import Index from "../features/home/Index.jsx";
import SurahList from "../features/home/SurahList.jsx";

const Home = () => {

  return (
    <>
        <Navbar />
        <Index />
        <SurahList />
    </>
  )
}

export default Home