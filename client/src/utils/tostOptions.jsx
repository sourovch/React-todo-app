export const ERROR_TOAST_OPTIONS = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const SUCCESS_TOAST_OPTIONS = {
  ...ERROR_TOAST_OPTIONS,
  position: 'bottom-right',
};
