export const uploadImageToCloudinary = async (imageUri: string) => {
  const formData = new FormData();
  
  // 1. Image එක FormData එකට එකතු කිරීම
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg', // හෝ පින්තූරයේ වර්ගය
    name: 'upload.jpg',
  } as any);

  // 2. Cloudinary Config දත්ත
  formData.append('upload_preset', process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('cloud_name', process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();
    return data.secure_url; 
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};