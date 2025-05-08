import apiClient from './apiClient';
import { API_URLS } from '../constants/apiUrls';
import { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/browser';

export const generateRegisterUser = (username: string) => {
    return apiClient.post(API_URLS.GENERATE_REGISTER_OPTIONS, { username },{
        validateStatus : (status) => status < 500
    });
};

export const verifyRegistrationUser = (username: string, attestationResponse: RegistrationResponseJSON) => {
    return apiClient.post(API_URLS.VERIFY_REGISTRATION, { username, attestationResponse });
};

export const generateAuthenticationLoginUser = (username: string) => {
    return apiClient.post(API_URLS.GENERATE_AUTHENTICATION_OPTIONS, { username });
};

export const verifyLoginUser = (username: string, assertionResponse: AuthenticationResponseJSON) => {
    return apiClient.post(API_URLS.VERIFY_AUTHENTICATION, { username, assertionResponse });
};

export const loginUser = (username: string,password : string) => {
    return apiClient.post(API_URLS.SIMPLE_LOGIN, { username ,password});
};

export const registerUser = (username: string, password: string) => {
    return apiClient.post(API_URLS.SIMPLE_REGISTER, { username , password });
};