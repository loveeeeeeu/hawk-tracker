import { auth } from './modules/auth';
import { authz } from './modules/authz';
import { analytics } from './modules/analytics';
import { application } from './modules/application';
import { reporting } from './modules/reporting';

export const api = {
  auth: auth,
  authz: authz,
  analytics: analytics,
  application: application,
  reporting: reporting,
};
