import React, { createContext, useContext, ReactNode } from 'react';
import {
  Id,
  ToastContainer,
  ToastContentProps,
  ToastOptions,
  toast,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApiResponse } from '../types/global';

const ToastContext = createContext({
  showToast: (
    _message: string,
    _type: 'success' | 'error' | 'info' | 'warning' = 'info',
  ) => {},
  showPromiseToast: (
    _promise: Promise<any>,
    _messages: {
      loading: string;
      success: (response: any) => string;
      error: (error: any) => string;
    },
  ) => {},
  showProgressToast: (
    _message: string,
    _progress: number,
    _toastId?: Id,
    _options?: ToastOptions,
  ): Id => {
    return '' || 0;
  },
});

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
  ) => {
    toast(message, { type });
  };

  const showPromiseToast = (
    promise: Promise<any>,
    messages: {
      loading: string;
      success: (message: string) => string;
      error: (message: string) => string;
    },
  ) => {
    toast.promise(promise, {
      pending: messages.loading,
      success: {
        render: ({ data }: ToastContentProps<ApiResponse<any>>) => {
          console.log('Success', data);
          return messages.success(data?.message || 'Success');
        },
      },
      error: {
        render({ data }: ToastContentProps<ApiResponse<any>>) {
          console.log('Error', data);
          return messages.error(data?.data?.message);
        },
      },
    });
  };

  const showProgressToast = (
    message: string,
    progress: number,
    toastId?: Id,
    options = {},
  ): Id => {
    const isUpdate = toastId != null;
    const toastOptions = {
      ...options,
      progress,
    };

    if (isUpdate) {
      toast.update(toastId, { render: message, ...toastOptions });
      return toastId;
    } else {
      return toast(message, toastOptions);
    }
  };

  return (
    <ToastContext.Provider
      value={{ showToast, showPromiseToast, showProgressToast }}
    >
      {children}
      <ToastContainer
        position="top-center"
        autoClose={2000}
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
