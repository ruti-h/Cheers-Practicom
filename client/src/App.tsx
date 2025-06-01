// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { Provider } from 'react-redux'
// // import { store } from '.' // נצטרך ליצור את הקובץ הזה

// import CandidatePage from "./components/Candidate"
// import Home from "./components/home.tsx"
// import LoginPage from "./components/login"
// import Shadchan from "./components/Shdchan"
// import RegisterPage from "./components/register"
// import MeetingPlaces from "./components/meetingPlaces"
// import CandidateGenderSelectionPage from "./components/CandidateGenderSelectionPage"
// import Layout from "./layot.tsx"
// import CandidateSummary from "./components/CandidateSummary.tsx"
// import Dashboard from "./components/dashboard.tsx" // הוסף את זה
// import store from "./components/store/store.ts"

// const App = () => {
//   return (
//     <Provider store={store}>
//       <Router>
//         <Layout>
//           <Routes>
//             {/* דפים ציבוריים */}
//             <Route path="/" element={<Home />} />
//             <Route path="register" element={<RegisterPage />} />
//             <Route path="/candidate" element={<CandidatePage />} />
//             <Route path="/candidate-gender" element={<CandidateGenderSelectionPage />} />
//             <Route path="login" element={<LoginPage />} />
//             <Route path="/Shadchan" element={<Shadchan />} />
//             <Route path="/meeting-places" element={<MeetingPlaces />} />
//             <Route path="/candidate-summary" element={<CandidateSummary />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             {/* נתיב ברירת מחדל */}
//             {/* <Route path="*" element={<Navigate to="/" />} /> */}
//           </Routes>
//         </Layout>
//       </Router>
//     </Provider>
//   )
// }

// export default App




import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from 'react-redux'

import CandidatePage from "./pages/Candidate.tsx"
import Home from "./pages/home.tsx"
import LoginPage from "./pages/login.tsx"
import Shadchan from "./pages/Shdchan.tsx"
import RegisterPage from "./pages/register.tsx"
import MeetingPlaces from "./pages/meetingPlaces.tsx"
import CandidateGenderSelectionPage from "./pages/CandidateGenderSelectionPage.tsx"
import Layout from "./components/Layot/layot.tsx"
import CandidateSummary from "./pages/CandidateSummary.tsx"
import Dashboard from "./pages/dashboard.tsx" // הוסף את זה
import store from "./store/store.ts"
import CandidateEdit from "./pages/CandidateEdit.tsx"

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            {/* דפים ציבוריים */}
            <Route path="/" element={<Home />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="/candidate" element={<CandidatePage />} />
            <Route path="/candidate-gender" element={<CandidateGenderSelectionPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="/Shadchan" element={<Shadchan />} />
            <Route path="/meeting-places" element={<MeetingPlaces />} />
            <Route path="/candidate-summary" element={<CandidateSummary />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="candidate-edit" element={<CandidateEdit/>}/>
            {/* נתיב ברירת מחדל */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App