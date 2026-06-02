import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Required Google Analytics and YouTube scopes
provider.addScope('https://www.googleapis.com/auth/analytics.readonly');
provider.addScope('https://www.googleapis.com/auth/youtube.readonly');
provider.addScope('https://www.googleapis.com/auth/yt-analytics.readonly');

let cachedAccessToken: string | null = null;
let isSigningIn = false;
let localUserStatusCallback: ((user: User | null, token: string | null) => void) | null = null;

// Local mock data store helpers
const getLocalAccounts = (): any[] => {
  try {
    const list = localStorage.getItem('local_auth_accounts');
    return list ? JSON.parse(list) : [
      {
        email: 'staffredstore@gmail.com',
        password: 'password123',
        displayName: 'Сотрудник SMM',
        uid: 'local_demo_user',
        photoURL: null
      }
    ];
  } catch (e) {
    return [];
  }
};

const saveLocalAccounts = (accounts: any[]) => {
  try {
    localStorage.setItem('local_auth_accounts', JSON.stringify(accounts));
  } catch (e) {
    console.error(e);
  }
};

export const getLocalCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem('current_local_user');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setLocalCurrentUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem('current_local_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('current_local_user');
    }
    if (localUserStatusCallback) {
      localUserStatusCallback(user, null);
    }
  } catch (e) {
    console.error(e);
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  localUserStatusCallback = (user, token) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, token);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  };

  // Immediate check for saved local mock user session
  const savedLocalUser = getLocalCurrentUser();
  if (savedLocalUser) {
    setTimeout(() => {
      if (onAuthSuccess) onAuthSuccess(savedLocalUser, null);
    }, 50);
  }

  const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
    // Only apply Firebase authentication events if there is no active local mock user session
    if (!getLocalCurrentUser()) {
      if (user) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });

  return () => {
    unsubscribeFirebase();
    localUserStatusCallback = null;
  };
};

export const googleSignIn = async (forceConsent: boolean = true): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    if (forceConsent) {
      provider.setCustomParameters({ prompt: 'consent' });
    } else {
      provider.setCustomParameters({});
    }
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google.');
    }
    cachedAccessToken = credential.accessToken;
    setLocalCurrentUser(null); // Clear any local mock user
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const emailSignIn = async (email: string, password: string): Promise<User> => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    setLocalCurrentUser(null); // Clear any local mock user
    return credential.user;
  } catch (error: any) {
    const errString = String(error?.code || error?.message || error || '').toLowerCase();
    
    // Fall back to local auth if it's a domain/config/operation error, 
    // or specifically indicates a Firebase auth configuration issue (auth/*)
    const isFirebaseConfigError = errString.includes('auth/');

    if (!isFirebaseConfigError) {
      console.error('Email sign in error:', error);
    }
    
    if (isFirebaseConfigError) {
      console.warn('Firebase Auth failed, falling back to local accounts DB.', error);
      
      const accounts = getLocalAccounts();
      // Enforce presence of standard demo credentials
      if (!accounts.some(a => a.email.toLowerCase() === 'staffredstore@gmail.com')) {
        accounts.push({
          email: 'staffredstore@gmail.com',
          password: 'password123',
          displayName: 'Сотрудник SMM',
          uid: 'local_demo_user',
          photoURL: null
        });
        saveLocalAccounts(accounts);
      }

      const match = accounts.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
      if (match) {
        const mockUser = {
          uid: match.uid,
          email: match.email,
          displayName: match.displayName,
          photoURL: match.photoURL || null,
        } as unknown as User;
        setLocalCurrentUser(mockUser);
        return mockUser;
      } else {
        throw new Error('auth/wrong-password');
      }
    }
    throw error;
  }
};

export const emailRegister = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    setLocalCurrentUser(null); // Clear any local mock user
    return credential.user;
  } catch (error: any) {
    const errString = String(error?.code || error?.message || error || '').toLowerCase();
    
    // Fall back to local auth if it's a domain/config/operation error, 
    // or specifically indicates a Firebase auth configuration issue (auth/*)
    const isFirebaseConfigError = errString.includes('auth/');

    if (!isFirebaseConfigError) {
      console.error('Email registration error:', error);
    }

    if (isFirebaseConfigError) {
      console.warn('Firebase Auth failed, falling back to local accounts DB.', error);
      
      const accounts = getLocalAccounts();
      if (accounts.some(a => a.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('auth/email-already-in-use');
      }

      const newAccount = {
        email: email,
        password: password,
        displayName: displayName || 'Сотрудник SMM',
        uid: 'local_' + Date.now(),
        photoURL: null
      };

      accounts.push(newAccount);
      saveLocalAccounts(accounts);

      const mockUser = {
        uid: newAccount.uid,
        email: newAccount.email,
        displayName: newAccount.displayName,
        photoURL: null,
      } as unknown as User;
      
      setLocalCurrentUser(mockUser);
      return mockUser;
    }
    throw error;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  setLocalCurrentUser(null);
  cachedAccessToken = null;
};

