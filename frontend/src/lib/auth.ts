import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './config';
import { createUser, getUserById } from './firestore';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const signUp = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, {
      displayName: displayName
    });
    
    await createUser({
      uid: user.uid,
      displayName: displayName,
      email: email,
    });
    
    return {
      success: true,
      user: user
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

export const signIn = async (
  email: string, 
  password: string
): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

export const logOut = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'Failed to sign out. Please try again.'
    };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};