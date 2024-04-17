// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import config from "../config";
import Firebase, {
  FacebookAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  sendSignInLinkToEmail,
  signInWithPhoneNumber,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
// import Error from "../Objects/models/Error";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export enum FirebaseAuthServiceErrorCode {
  /**
   * Thrown if a method is called with incorrect arguments.
   */
  ARGUMENT_ERROR = "auth/argument-error",
  /**
   *  Thrown if the user's credential is no longer valid. The user must sign in again.
   */
  INVALID_USER_TOKEN = "auth/invalid-user-token",
  /**
   *  Thrown if a network error (such as timeout, interrupted connection or unreachable host) has occurred.
   */
  NETWORK_REQUEST_FAILED = "auth/network-request-failed",
  /**
   * Thrown if the user's last sign-in time does not meet the security threshold. Use User#reauthenticateWithCredential to resolve. This does not apply if the user is anonymous.
   */
  REQUIRES_RECENT_LOGIN = "auth/requires-recent-login",
  /**
   * Thrown if requests are blocked from a device due to unusual activity. Trying again after some delay would unblock.
   */
  TOO_MANY_REQUESTS = "auth/too-many-requests",
  /**
   * Thrown if the user account has been disabled by an administrator. Accounts can be enabled or disabled in the Firebase Console, the Auth section and Users subsection.
   */
  USER_DISABLED = "auth/user-disabled",
  /**
   * Thrown if the user's credential has expired. This could also be thrown if a user has been deleted. Prompting the user to sign in again should resolve this for either case.
   */
  USER_TOKEN_EXPIRED = "auth/user-token-expired",
  /**
   * Thrown if the email address is not valid.
   */
  INVALID_EMAIL = "auth/invalid-email",
  /**
   * Thrown if there is no user corresponding to the given email.
   */
  INVALID_LOGIN_CREDENTIALS = "auth/invalid-credential",
  /**
   * Thrown if the password is invalid for the given email, or the account corresponding to the email does not have a password set.
   */
  WRONG_PASSWORD = "auth/wrong-password",
  /**
   * Thrown if there already exists an account with the given email address.
   */
  EMAIL_EXISTS = "auth/email-already-in-use",
  /**
   * Thrown if the password is not strong enough. The password must'nt be less than 6 chars.
   */
  WEAK_PASSWORD = "auth/weak-password",
  /**
   * Thrown if the reCAPTCHA response token was invalid, expired, or if this method was called from a non-whitelisted domain.
   */
  CAPTCHA_CHECK_FAILED = "auth/captcha-check-failed",
  /**
   * Thrown if the phone number has an invalid format.
   */
  INVALID_PHONE_NUMBER = "auth/invalid-phone-number",
  /**
   * Thrown if the phone number is missing.
   */
  MISSING_PHONE_NUMBER = "auth/missing-phone-number",
  /**
   * Thrown if the phone number is missing.
   */
  ERROR_INVALID_VERIFICATION_CODE = "auth/error-invalid-verification_code",
  /**
   * Thrown if the  permission are insufficient, EG company phone or VM.
   */
  INSUFFICIENT_PERMISSION = "auth/insufficient-permission	",
  /**
   * Thrown if the app is wrongly configured.
   */
  INVALID_APP_CREDENTIAL = "auth/invalid-app-credential	",
  /**
   * Thrown if the SMS quota for the Firebase project has been exceeded.
   */
  QUOTA_EXCEEDED = "auth/quota-exceeded",
  /**
   * Thrown if there already exists an account with the email address asserted by the credential. Resolve this by calling auth#fetchSignInMethodsForEmail and then asking the user to sign in using one of the returned providers. Once the user is signed in, the original credential can be linked to the user with User#linkWithCredential.
   */
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL = "auth/account-exists-with-different-credential",
  /**
   * Thrown if the credential is malformed or has expired.
   */
  INVALID_CREDENTIAL = "auth/invalid-credential",
  /**
   * Thrown when user cancels the sign in flow.
   * @see https://github.com/react-native-community/react-native-google-signin#statuscodes
   */
  GOOGLE_SIGN_IN_CANCELLED = "auth/google/sign-in-cancelled",
  /**
   * Thrown when trying to invoke another sign in flow (or any of the other operations) when previous one has not yet finished.
   * @see https://github.com/react-native-community/react-native-google-signin#statuscodes
   */
  GOOGLE_IN_PROGRESS = "auth/google/in-progress",
  /**
   * Useful for use with signInSilently() - no user has signed in yet.
   * @see https://github.com/react-native-community/react-native-google-signin#statuscodes
   */
  GOOGLE_SIGN_IN_REQUIRED = "auth/google/sign-in-required",
  /**
   * Thrown when play services are not available or outdated, this can only happen on Android
   * @see https://github.com/react-native-community/react-native-google-signin#statuscodes
   */
  GOOGLE_PLAY_SERVICES_NOT_AVAILABLE = "auth/google/play-services-not-available",
  /**
   * Thrown when an unknown error occurs.
   */
  GOOGLE_UNKNOWN = "auth/google/unknown",
  /**
   * Thrown when user cancels the sign in flow.
   */
  FACEBOOK_SIGN_IN_CANCELLED = "auth/facebook/sign-in-cancelled",
  /**
   * Thrown when an unknown error occurs.
   */
  FACEBOOK_UNKNOWN = "auth/facebook/unknown",
}

// Initialize Firebase
const app = initializeApp(config.firebase);
const auth = getAuth(app);

const getJWTToken = async (user: Firebase.User) => {
  return user.getIdToken(false);
};

/**
 * Send to the user mail a verification link.
 * @param email
 */

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile")
googleProvider.addScope("https://www.googleapis.com/auth/user.phonenumbers.read")
const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};
const facebookProvider = new FacebookAuthProvider();
const signInWithFacebook = async () => {

  return signInWithPopup(auth, facebookProvider);

};
const logInWithEmailAndPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
const getCurrentUser = async (
  
) => {
  return auth.currentUser;
};

const sendPasswordReset = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};
const UpdateUserPassword = async (password: string) => {
  return updatePassword(auth.currentUser!, password);
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  getJWTToken,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getCurrentUser,
  signInWithFacebook,
  UpdateUserPassword,
};
