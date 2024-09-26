import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Footer from './components/FooterC'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import CreatePost from './pages/CreatePost'



function App() {

  return (
   <>
     <BrowserRouter>
       <Header />
       <Routes>
         <Route path='/' element = {<Home />} />
         <Route path='/about' element = {<About />} />
         <Route path='/projects' element = {<Projects />} />
         <Route path='/signin' element = {<Signin />} />
         <Route path='/signup' element = {<Signup />} />
         <Route element={<ProtectedRoute />}>
             <Route path='/dashboard' element = {<Dashboard />} />
         </Route>
         <Route element={<AdminRoute />}>
             <Route path='/create-post' element = {<CreatePost />} />
         </Route>
       </Routes>
       <Footer />
     </BrowserRouter>
   </>
  )
}

export default App
