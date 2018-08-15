export interface MNMConfig {
  oauthConfig?: {
    claimsUrl: string;
    oauthUrl: string;
  };
  http?: {
    contentType?: string;
  };
}
