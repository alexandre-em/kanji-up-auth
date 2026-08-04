export type VerifiedGoogleIdentity = {
  providerId: string;
  email: string | null;
  picture: string | null;
  name: string | null;
};

export abstract class GoogleIdentityRepository {
  // Throws if the token is missing, expired, or its signature/audience don't check out — never
  // trust a client-supplied providerId directly
  abstract verifyIdToken(idToken: string): Promise<VerifiedGoogleIdentity>;
}
