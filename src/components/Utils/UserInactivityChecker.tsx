import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../../features/Auth/authSlice';
import { Snackbar, Button } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { handlePersistorPurge } from "../../app/store";
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';


interface UserInactivityCheckerProps {
  timeoutInMinutes?: number;
  warningTimeInMinutes?: number;
}

const UserInactivityChecker: React.FC<UserInactivityCheckerProps> = ({
  timeoutInMinutes = 15,
  warningTimeInMinutes = 5
}) => {
  const dispatch = useDispatch();
  const [showWarning, setShowWarning] = useState(false);
  const [timeBeforeReset, setTimeBeforeReset] = useState<Date>(new Date(Date.now() + timeoutInMinutes * 60 * 1000));

  let intervalId: TimeoutId;

  useEffect(() => {
    let timeoutId: number;
    let warningTimeoutId: number;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearInterval(intervalId);

      const remainingTime = timeoutInMinutes * 60 * 1000;

      warningTimeoutId = window.setTimeout(() => {
        setShowWarning(true);
        setTimeBeforeReset(new Date(Date.now() + remainingTime));
        intervalId = setInterval(() => {
          setTimeBeforeReset(new Date(Date.now() + remainingTime));
        }, 1000);
      }, remainingTime - warningTimeInMinutes * 60 * 1000);

      timeoutId = window.setTimeout(() => {
        dispatch(clearCredentials());
        handlePersistorPurge();
      }, remainingTime);
    };

    const events: string[] = ['click', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearInterval(intervalId);
    };
  }, [dispatch, timeoutInMinutes, warningTimeInMinutes]);

  const handleClose = () => {
    setShowWarning(false);
    clearInterval(intervalId);
  };

  return (
    <Snackbar
      open={showWarning}
      message={`You will be logged out ${formatDistanceToNow(timeBeforeReset, { addSuffix: true })} due to inactivity.`}
      action={
        <Button color="inherit" size="small" onClick={handleClose}>
          Close
        </Button>
      }
    />
  );
};

export default UserInactivityChecker;
