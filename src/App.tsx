import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ListingsProvider>
          <ChatProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </ChatProvider>
        </ListingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;