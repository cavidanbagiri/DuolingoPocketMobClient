import $api from "../http/api";

export const generateSpeech = async (data) => {
    console.log('sendingh data to backend is ', data);
  const response = await $api.post(`/words/voice`, data, {
    responseType: 'blob'
  });
  return response.data; // Returns the Blob
};