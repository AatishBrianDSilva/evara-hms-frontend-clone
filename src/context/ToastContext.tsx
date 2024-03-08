import React, { createContext, useContext, ReactNode } from 'react';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext({
  showToast: (_message: string, _type: "success" | "error" | "info" | "warning" = "info") => { },
  showPromiseToast: (
    _promise: Promise<any>,
    _messages: {
      loading: string;
      success: (response: any) => string;
      error: (error: any) => string;
    }
  ) => { },
  showProgressToast: (_message: string, _progress: number, _toastId?: string | number, _options?: ToastOptions) => { }
});

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    toast(message, { type });
  };

  const showPromiseToast = (
    promise: Promise<any>,
    messages: {
      loading: string;
      success: (response: any) => string;
      error: (error: any) => string;
    }
  ) => {
    toast.promise(
      promise,
      {
        pending: messages.loading,
        success: {
          render({ data }) {
            return messages.success(data);
          }
        },
        error: {
          render({ data }) {
            return messages.error(data);
          }
        },
      }
    );
  };

  const showProgressToast = (message: string, progress: number, toastId?: string | number, options = {}) => {
    const isUpdate = toastId != null;
    const toastOptions = {
      ...options,
      progress,
    };

    if (isUpdate) {
      toast.update(toastId, { render: message, ...toastOptions });
    } else {
      return toast(message, toastOptions);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showPromiseToast, showProgressToast }}>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
