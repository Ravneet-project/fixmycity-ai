import Navbar from "../components/Navbar";
import HeroSection from "../sections/HeroSection";
import CityJourney from "../sections/CityJourney";
import ReportIssue from "../sections/ReportIssue";
import ExploreIssues from "../sections/ExploreIssues";
import ImpactSection from "../sections/ImpactSection";
import Footer from "../sections/Footer";
import TrackComplaint from "../sections/TrackComplaint";

const Home = () => {
  return (
    <div className="app-shell">
      <div className="background-grid"></div>
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <Navbar />

      <main>
        <HeroSection />
        <CityJourney />
        <ReportIssue />
        <ExploreIssues />
        <TrackComplaint />
        <ImpactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;