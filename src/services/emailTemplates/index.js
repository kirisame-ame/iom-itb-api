import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

export const getEmailTemplates = async () => {
  const response = await axios.get(
    `${API_URL}/email-templates`
  );

  return response.data;
};

export const updateEmailTemplate = async (
  key,
  payload
) => {
  const response = await axios.put(
    `${API_URL}/email-templates/${key}`,
    payload
  );

  return response.data;
};