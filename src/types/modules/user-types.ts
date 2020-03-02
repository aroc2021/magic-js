export interface GetIdTokenConfiguration {
  /**
   * The number of seconds until the generated ID token will expire.
   */
  lifespan?: number;
}

export interface MagicUserMetadata {
  publicAddress: string | null;
  email: string | null;
}