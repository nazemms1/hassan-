import Capabilities from './components/Capabilities'
import Contact from './components/Contact'
import Credentials from './components/Credentials'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Profile from './components/Profile'
import TopBar from './components/TopBar'
import Work from './components/Work'

export default function App() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Work />
        <Profile />
        <Experience />
        <Capabilities />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
