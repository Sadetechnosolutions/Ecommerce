import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Signin from './pages/signin';
import Forgotpassword from './components/forgotpassword';
import Signup from './pages/signup';
import Default from './pages/default';
import Menu from './pages/menu';
import Home from './pages/home';
import Profileheader from './userview/Profileheader';
import ProfileView from './userview/profile';
import Post from './userview/timeline';
import Friends from './userview/friendlist';
import Photos from './userview/Photos';
import Videos from './userview/videos';
import Displayphoto from './pages/displaypost';
import StoryPage from './pages/storydisplay';
import Friendrequest from './pages/friendrequest';
import Notifications from './pages/notifications';
import MessageList from './pages/messagelist';
import Chat from './pages/chat';
import StoryUpload from './components/createstory';
import Postinfo from './components/postDetails';
import Birthday from './components/birthday';
import Search from './components/search';
import Weather from './components/weather';
import Formbar from './components/formheader';
import Reels from './components/reels';
import DisplayReels from './pages/displayreels';
import Profession from './components/profession';
import Aboutus from './pages/professional';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Default />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/forgotpassword' element={<Forgotpassword />} />
        <Route path='/signup' element={<Signup />}/>
        <Route path='/newsfeed' element={<DefaultWithNavbar><Home /></DefaultWithNavbar>}/>
        <Route path='/menu' element={<Menu />} />
        <Route path='/user/:userID' element={<DefaultWithNavbar><DefaultHeader><ProfileView/></DefaultHeader></DefaultWithNavbar>} />
        <Route path='/timeline/:userID' element={<DefaultWithNavbar><DefaultHeader><Post /></DefaultHeader></DefaultWithNavbar>}/>
        <Route path='/friends/:userID' element={<DefaultWithNavbar><DefaultHeader><Friends /></DefaultHeader></DefaultWithNavbar>} />
        <Route path='/photos/:userID' element={<DefaultWithNavbar><DefaultHeader><Photos /></DefaultHeader></DefaultWithNavbar>} />
        <Route path='/videos/:userID' element={<DefaultWithNavbar><DefaultHeader><Videos /></DefaultHeader></DefaultWithNavbar>} />
        <Route path='/post/:userID/:postID' element={<DefaultWithNavbar><Displayphoto /></DefaultWithNavbar>} />
        <Route path='/storypage' element={<StoryPage />}/>
        <Route path='/friendrequest' element={<DefaultWithNavbar> <Friendrequest /></DefaultWithNavbar>}/>
        <Route path='/notifications' element={<DefaultWithNavbar> <Notifications /></DefaultWithNavbar>}/>
        <Route path='/messages' element={<DefaultWithNavbar> <MessageList /></DefaultWithNavbar>}/>
        <Route path='/messages/:messageID' element={<Chat />} />
        <Route path='/uploadStory' element={<StoryUpload />} />
        <Route path='/postinfo' element={<Postinfo />} />
        <Route path='/birthdays' element={<DefaultWithNavbar><Birthday /></DefaultWithNavbar>} />
        <Route path='/weather' element={<DefaultWithNavbar><Weather /></DefaultWithNavbar>} />
        <Route path='/search' element={<DefaultWithNavbar><Search /></DefaultWithNavbar>} />
        <Route path='/profiledetails' element={<Formbar />} />
        <Route path='/reels' element={<Reels />} />
        <Route path='/Reels/:userID' element={<DisplayReels />} />
        <Route path='/profession/:userID' element={<Aboutus />} />
      </Routes>
    </Router>
    </>
  );
}

const DefaultWithNavbar = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

const DefaultHeader = ({ children }) => {
  return (
    <>
      <Profileheader />
      {children}
    </>
  );
}




export default App;
