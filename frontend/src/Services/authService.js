// services/authService.js
import axiosInstance from '../config/Api';

/**
 * Login user with email and password
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {boolean} credentials.rememberMe - Remember me option
 * @returns {Promise} - Response with user data and token
 */
export const loginUser = async ({ email, password, rememberMe }) => {
  try {
    // Validate inputs before making API call
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Make API request using axios instance
    const response = await axiosInstance.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password: password,
      rememberMe: rememberMe || false
    });

    // Check if response contains required data
    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    // Destructure response data
    const { 
      user, 
      token, 
      refreshToken, 
      expiresIn,
      requiresTwoFactor = false 
    } = response.data;

    // Validate response data
    if (!user || !token) {
      throw new Error('Invalid response format from server');
    }

    // Store tokens securely
    if (token) {
      localStorage.setItem('fitai_token', token);
      
      // Store refresh token if provided and remember me is checked
      if (rememberMe && refreshToken) {
        localStorage.setItem('fitai_refresh_token', refreshToken);
      }
      
      // Store token expiry if provided
      if (expiresIn) {
        const expiryTime = new Date().getTime() + (expiresIn * 1000);
        localStorage.setItem('fitai_token_expiry', expiryTime.toString());
      }
    }

    // Store basic user info (without sensitive data)
    const safeUserData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.name,
      preferences: user.preferences || {},
      stats: user.stats || {}
    };
    
    localStorage.setItem('fitai_user', JSON.stringify(safeUserData));

    // Return formatted response
    return {
      success: true,
      user: user,
      token: token,
      refreshToken: refreshToken,
      expiresIn: expiresIn,
      requiresTwoFactor: requiresTwoFactor,
      message: response.data.message || 'Login successful'
    };

  } catch (error) {
    // Handle axios specific errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }

    // Handle HTTP error responses
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          throw new Error(serverMessage || 'Invalid request. Please check your input.');
        
        case 401:
          throw new Error(serverMessage || 'Invalid email or password');
        
        case 403:
          if (error.response.data?.requiresVerification) {
            throw {
              type: 'VERIFICATION_REQUIRED',
              message: serverMessage || 'Please verify your email before logging in',
              email: email
            };
          }
          if (error.response.data?.accountLocked) {
            throw {
              type: 'ACCOUNT_LOCKED',
              message: serverMessage || 'Account is locked. Please reset your password or contact support',
              lockDuration: error.response.data?.lockDuration
            };
          }
          throw new Error(serverMessage || 'Access denied');
        
        case 404:
          throw new Error(serverMessage || 'Account not found');
        
        case 422:
          throw new Error(serverMessage || 'Invalid input data');
        
        case 429:
          throw new Error('Too many login attempts. Please try again later.');
        
        case 500:
        case 502:
        case 503:
          throw new Error('Server error. Please try again later.');
        
        default:
          throw new Error(serverMessage || `Login failed with status ${status}`);
      }
    } 
    // Handle request errors (no response received)
    else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } 
    // Handle other errors
    else {
      throw new Error(error.message || 'An unexpected error occurred during login');
    }
  }
};

/**
 * Verify two-factor authentication code after login
 * @param {string} userId - User ID
 * @param {string} code - 2FA code
 * @param {string} tempToken - Temporary token from initial login
 * @returns {Promise} - Final login response
 */
export const verifyTwoFactorLogin = async (userId, code, tempToken) => {
  try {
    const response = await axiosInstance.post('/api/auth/2fa/verify-login', {
      userId,
      code,
      tempToken
    });

    if (response.data.token) {
      localStorage.setItem('fitai_token', response.data.token);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Invalid 2FA code');
    }
    throw new Error('Failed to verify 2FA code');
  }
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise} - Resend confirmation
 */
export const resendVerificationEmail = async (email) => {
  try {
    const response = await axiosInstance.post('/api/auth/resend-verification', {
      email: email.trim().toLowerCase()
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to resend verification email');
    }
    throw new Error('Network error. Please try again.');
  }
};


/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response with user data and token
 */
export const registerUser = async (userData) => {
  try {
    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'password', 'confirmPassword',
      'age', 'biologicalSex', 'height', 'weight',
      'activityLevel', 'experienceLevel', 'primaryGoal',
      'medicalDisclaimer', 'termsAccepted'
    ];

    for (const field of requiredFields) {
      if (!userData[field] && field !== 'confirmPassword') {
        throw new Error(`${field} is required`);
      }
    }

    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      throw new Error('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character');
    }

    // Validate age range
    const age = parseInt(userData.age);
    if (age < 15 || age > 70) {
      throw new Error('Age must be between 15 and 70');
    }

    // Validate height range
    const height = parseInt(userData.height);
    if (height < 120 || height > 220) {
      throw new Error('Height must be between 120-220 cm');
    }

    // Validate weight range
    const weight = parseInt(userData.weight);
    if (weight < 30 || weight > 200) {
      throw new Error('Weight must be between 30-200 kg');
    }

    // Make API request
    const response = await axiosInstance.post('/api/auth/register', {
      fullName: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      age: parseInt(userData.age),
      biologicalSex: userData.biologicalSex,
      height: parseInt(userData.height),
      weight: parseInt(userData.weight),
      activityLevel: userData.activityLevel,
      experienceLevel: userData.experienceLevel,
      primaryGoal: userData.primaryGoal,
      medicalDisclaimer: userData.medicalDisclaimer,
      termsAccepted: userData.termsAccepted,
      createdAt: new Date().toISOString()
    });

    // Check response
    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    const { user, token, refreshToken, expiresIn } = response.data;

    // Store tokens
    if (token) {
      localStorage.setItem('fitai_token', token);
      
      if (refreshToken) {
        localStorage.setItem('fitai_refresh_token', refreshToken);
      }
      
      if (expiresIn) {
        const expiryTime = new Date().getTime() + (expiresIn * 1000);
        localStorage.setItem('fitai_token_expiry', expiryTime.toString());
      }
    }

    // Store user data
    if (user) {
      const safeUserData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        preferences: user.preferences || {
          theme: 'light',
          notifications: true
        }
      };
      localStorage.setItem('fitai_user', JSON.stringify(safeUserData));
    }

    return {
      success: true,
      user,
      token,
      refreshToken,
      expiresIn,
      message: response.data.message || 'Registration successful'
    };

  } catch (error) {
    // Handle axios errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }

    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }

    // Handle HTTP errors
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          throw new Error(serverMessage || 'Invalid registration data');
        
        case 409:
          throw new Error(serverMessage || 'Email already exists');
        
        case 422:
          throw new Error(serverMessage || 'Validation failed');
        
        case 429:
          throw new Error('Too many registration attempts. Please try again later.');
        
        case 500:
        case 502:
        case 503:
          throw new Error('Server error. Please try again later.');
        
        default:
          throw new Error(serverMessage || `Registration failed with status ${status}`);
      }
    }

    // Re-throw validation errors
    throw error;
  }
};