import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const getProfile = () => API.get('/users/profile');
export const getBalance = () => API.get('/accounts/balance');
export const depositMoney = (amount) => API.post('/accounts/deposit', { amount });
export const transferMoney = (toUserId, amount, description) =>
  API.post('/accounts/transfer', { toUserId, amount, description });
export const checkLoanEligibility = () => API.get('/loans/eligibility');
export const requestLoan = (amount, description) =>
  API.post('/loans/request', { amount, description });
export const lendMoney = (borrowerId, amount, interestRate) =>
  API.post('/loans/lend', { borrowerId, amount, interestRate });
export const repayLoan = (loanId) => API.post('/loans/repay', { loanId });
export const createPod = (podName, goalAmount) =>
  API.post('/pods/create', { podName, goalAmount });
export const joinPod = (podId, monthlyGoal) =>
  API.post('/pods/join', { podId, monthlyGoal });
export const getAllPods = () => API.get('/pods/all');
export const getLeaderboard = () => API.get('/leaderboard/top-savers');
export const getTopLenders = () => API.get('/leaderboard/top-lenders');

export default API;
