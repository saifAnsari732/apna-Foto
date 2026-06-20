import { API_URL } from '../config/api';
import { Platform } from 'react-native';

const IMAGEKIT_PUBLIC_KEY = 'public_sYY66HtGBs108dWZhJmIPrcuLSo=';
const UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';

export const uploadToImageKit = async (localUri) => {
  if (!localUri) return null;

  try {
    // 1. Fetch authentication parameters from local backend
    const authResponse = await fetch(`${API_URL}/api/imagekit/auth`);
    if (!authResponse.ok) {
      throw new Error('Failed to get ImageKit upload auth parameters from backend.');
    }
    const { token, expire, signature } = await authResponse.json();

    // 2. Prepare FormData
    const formData = new FormData();
    
    const filename = localUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    if (Platform.OS === 'web') {
      // On Web, we must fetch the Blob from the local URL
      const response = await fetch(localUri);
      const blob = await response.blob();
      formData.append('file', blob, filename);
    } else {
      // On Native, we pass the file object for FormData
      formData.append('file', {
        uri: Platform.OS === 'android' ? localUri : localUri.replace('file://', ''),
        name: filename,
        type: type,
      });
    }
    
    formData.append('fileName', filename);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', signature);
    formData.append('expire', expire.toString());
    formData.append('token', token);

    // 3. Make upload request directly to ImageKit CDN
    const uploadResponse = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header manually for FormData, it breaks the boundary!
    });

    const uploadResult = await uploadResponse.json();
    if (uploadResponse.ok) {
      console.log('ImageKit Upload Success:', uploadResult.url);
      return uploadResult.url; // Returns the public image URL hosted on CDN
    } else {
      console.error('ImageKit Upload Fail:', uploadResult);
      throw new Error(uploadResult.message || 'ImageKit upload failed.');
    }
  } catch (error) {
    console.error('ImageKit Helper Error:', error);
    throw error;
  }
};
