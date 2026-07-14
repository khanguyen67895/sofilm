export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  createdAt: string;
}

/** Shape of the decoded JWT payload returned by GET /auth/me — not a full profile. */
export interface AuthIdentity {
  sub: string;
  email: string;
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RequestPhoneOtpPayload {
  phone: string;
}

export interface VerifyPhoneOtpPayload {
  phone: string;
  code: string;
}
