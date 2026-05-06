import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from '../plugins/firebase';
import {
  loginUser,
  registerUser,
  logoutUser,
  sendPasswordReset,
  sendVerificationEmail,
} from './auth.service';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../plugins/firebase', () => ({ auth: {} }));

const randomString = () => Math.random().toString(36).substring(2);
const randomEmail = () => `${randomString()}@test.com`;

describe('loginUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls signInWithEmailAndPassword with the correct arguments', async () => {
    const email = randomEmail();
    const password = randomString();
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as any);

    await loginUser(email, password);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });

  it('returns the UserCredential from Firebase', async () => {
    const fakeCredential = { user: { uid: randomString() } } as any;
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(fakeCredential);

    const result = await loginUser(randomEmail(), randomString());

    expect(result).toBe(fakeCredential);
  });

  it('propagates the error when Firebase rejects', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new Error('auth/invalid-credential'),
    );

    await expect(loginUser(randomEmail(), randomString())).rejects.toThrow(
      'auth/invalid-credential',
    );
  });
});

describe('registerUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls createUserWithEmailAndPassword with the correct arguments', async () => {
    const email = randomEmail();
    const password = randomString();
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({} as any);

    await registerUser(email, password);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });

  it('propagates the error when the email is already in use', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(
      new Error('auth/email-already-in-use'),
    );

    await expect(registerUser(randomEmail(), randomString())).rejects.toThrow(
      'auth/email-already-in-use',
    );
  });
});

describe('logoutUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls signOut with the auth instance', async () => {
    vi.mocked(signOut).mockResolvedValue();

    await logoutUser();

    expect(signOut).toHaveBeenCalledWith(auth);
  });
});

describe('sendPasswordReset', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls sendPasswordResetEmail with the correct email', async () => {
    const email = randomEmail();
    vi.mocked(sendPasswordResetEmail).mockResolvedValue();

    await sendPasswordReset(email);

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, email);
  });

  it('propagates the error when Firebase rejects', async () => {
    vi.mocked(sendPasswordResetEmail).mockRejectedValue(
      new Error('auth/user-not-found'),
    );

    await expect(sendPasswordReset(randomEmail())).rejects.toThrow(
      'auth/user-not-found',
    );
  });
});

describe('sendVerificationEmail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls sendEmailVerification with the user object', async () => {
    const fakeUser = { uid: randomString() } as any;
    vi.mocked(sendEmailVerification).mockResolvedValue();

    await sendVerificationEmail(fakeUser);

    expect(sendEmailVerification).toHaveBeenCalledWith(fakeUser);
  });
});
