import $api from "../http/api";

export const generateSpeech = async (data) => {
  const response = await $api.post(`/words/voice`, data, {
    responseType: 'blob'
  });
  return response.data; // Returns the Blob
};