import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RouterList from './routes';
import './i18n/index';
import { ConfigProvider } from 'antd';
import { ThemeContext } from './providers/ThemeContext';
import { themeAntd } from './styles/themeColors';
import { useContext, useMemo } from 'react';
import { NoticeProvider } from './providers/NoticeProvider';
import { NotificationProvider } from './providers/NotificationContext';

function App() {
  const { theme } = useContext(ThemeContext);
  const antdTheme = useMemo(() => themeAntd(theme), [theme]);

  return (
    <ConfigProvider theme={antdTheme}>
      <NotificationProvider>
        <NoticeProvider>
          <BrowserRouter>
            <RouterList />
          </BrowserRouter>
        </NoticeProvider>
      </NotificationProvider>

    </ConfigProvider>
  );
}

export default App;
