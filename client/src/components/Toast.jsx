import { ToastContainer } from 'react-toastify';
import { useTheme } from '../context/themeContex';

const Toast = (props) => {
  const [theme] = useTheme();

  return (
    <ToastContainer
      {...props}
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
    />
  );
};

export default Toast;
