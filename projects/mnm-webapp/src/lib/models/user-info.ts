import {Claim} from './claim';
/**
 * Created by mohammed on 4/3/17.
 */
export interface UserInfo {
  isLoggedIn: boolean;
  claims: Claim[];
}
