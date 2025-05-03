import axios from 'axios';

export default async function detectImage(uri : any) {
  const formData = new FormData();

  const uriParts = uri.split('.');
  const fileExtension = uriParts[uriParts.length - 1].toLowerCase();
  const fileName = `media.${fileExtension}`;

  const mimeTypeMap: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
  };
  const mimeType = mimeTypeMap[fileExtension] || (fileExtension.startsWith('video') ? `video/${fileExtension}` : `image/${fileExtension}`);

  try {
    formData.append('file', {
      uri: uri,
      name: fileName,
      type: mimeType,
    } as any);

    const res = await axios.post(
      'http://192.168.1.131:5000',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const result = res.data;
    return result;
  } catch (err) {
    console.error('Full error:', err)
  }
}