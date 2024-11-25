import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from './apiConfig';
import { store } from '../app/store';

interface DownloadFileOptions {
  endpoint: string;
  params?: Record<string, any>;
  fileName?: string;
  successMessage?: string;
  errorMessage?: string;
  startMessage?: string;
}

export const downloadFileWithToast = async ({
  endpoint,
  params = {},
  fileName = 'download.csv',
  successMessage = 'Download successful!',
  errorMessage = 'Download failed.',
  startMessage = 'Preparing download...',
}: DownloadFileOptions) => {
  toast.info(startMessage, { autoClose: 2000 });

  const baseUrl = API_BASE_URL;
  const url = `${baseUrl}/${endpoint}`;

  try {
    // Access the Redux store to get the token
    const state = store.getState();
    const token = state.auth.tokens?.authToken;

    // Set up headers
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get(url, {
      params,
      headers,
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'text/csv',
    });
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    toast.success(successMessage, { autoClose: 2000 });
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error(errorMessage, { autoClose: 2000 });
  }
};
