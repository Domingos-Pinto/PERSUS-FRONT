import Welcome from "../../Components/sections/Welcome";
import About from "../../Components/sections/About";
import Services from "../../Components/sections/Services";
import Blog from "../../Components/sections/Blog";
import Contact from "../../Components/sections/Contact";

function Home() {
  return (
    <>
      <Welcome />
      <About />
      <Services />
      <Blog />
      <Contact />
    </>
  );
}

export default Home;
