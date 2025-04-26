import Navbar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div>
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;