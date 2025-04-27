import apiClient from './apiClient';
import { API_URLS } from '../constants/apiUrls';

export const registerUser = (username: string) => {
  return apiClient.post(API_URLS.REGISTER_OPTIONS, { username });
};

export const verifyRegistration = (username: string, attestationResponse: any) => {
  return apiClient.post(API_URLS.VERIFY_REGISTRATION, { username, attestationResponse });
};

export const loginUser = (username: string) => {
  return apiClient.post(API_URLS.LOGIN_OPTIONS, { username });
};

export const verifyLogin = (username: string, assertionResponse: any) => {
  return apiClient.post(API_URLS.VERIFY_LOGIN, { username, assertionResponse });
};
