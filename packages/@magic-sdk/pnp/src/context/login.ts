import { createMagicInstance, getScriptData } from '../utils';

export async function login(): Promise<void> {
  const { src, apiKey, redirectURI = `${window.location.origin}/callback`, debug } = getScriptData();

  const magic = createMagicInstance(apiKey, src.origin);

  async function handleOAuthLogin(provider: any) {
    await magic.pnp.saveLastUsedProvider(provider);
    await magic.oauth.loginWithRedirect({ provider, redirectURI });
  }

  async function handleEmailLinkLogin(email: any) {
    await magic.pnp.saveLastUsedProvider('email_link');
    const didt = await magic.auth.loginWithMagicLink({ email, redirectURI });
    window.location.href = `${redirectURI}?didt=${encodeURIComponent(didt!)}`;
  }

  async function handleSMSLogin(phoneNumber: any) {
    await magic.pnp.saveLastUsedProvider('sms');
    const didt = await magic.auth.loginWithSMS({ phoneNumber });
    window.location.href = `${redirectURI}?didt=${encodeURIComponent(didt!)}`;
  }

  const [loginType, arg] = await magic.pnp.getLoginMethod(debug);

  switch (loginType) {
    case 'oauth2':
      return handleOAuthLogin(arg).catch(login);

    case 'email_link':
      return handleEmailLinkLogin(arg).catch(login);

    case 'sms':
      return handleSMSLogin(arg).catch(login);

    default:
      return login();
  }
}
