import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRefreshTokenMutation } from '../../services/authApi';
import { RootState } from '../../app/store';

const TokenRefresher: React.FC = () => {
  const { tokens } = useSelector((state: RootState) => state.auth);
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const now = Date.now();
      if (tokens && tokens.expiresAt - now < 5 * 60 * 1000) {
        // Check if the token expires in less than 5 minutes
        refreshToken({ refreshToken: tokens.refreshToken });
      }
    };

    // Run check immediately in case the token is already near expiry when the component mounts
    checkTokenExpiry();

    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [tokens, refreshToken]);

  return null;
};

export default TokenRefresher;
