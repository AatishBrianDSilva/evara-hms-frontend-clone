import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL2 } from './apiConfig';
import { store } from '../app/store';

interface DownloadFileOptions {
  endpoint: string;
  params?: string;
  fileName?: string;
  successMessage?: string;
  errorMessage?: string;
  startMessage?: string;
}

export const downloadFileWithToast = async ({
  endpoint,
  params = '',
  fileName = 'download.csv',
  successMessage = 'Download successful!',
  errorMessage = 'File is being prepared, please try again later.',
  startMessage = 'Preparing download...',
}: DownloadFileOptions) => {
  toast.info(startMessage, { autoClose: 2000 });

  const baseUrl = API_BASE_URL2;
  const url = `${baseUrl}/${endpoint}?${params}`;

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
      headers,
      responseType: 'blob',
    });
    console.log('Response Data:', response.data);

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });

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
