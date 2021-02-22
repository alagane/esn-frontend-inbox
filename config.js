window.esnAuthConfig = {
  authProvider: 'oidc',
  authProviderSettings: {
    authority: 'http://auth.example.com/',
    client_id: 'my-app',
    redirect_uri: 'http://localhost:9900/inbox/#/auth/oidc/callback',
    silent_redirect_uri: 'http://localhost:9900/inbox/auth/silent-renew.html',
    post_logout_redirect_uri: 'http://localhost:9900/',
    response_type: 'code',
    scope: 'openid email profile'
  }
};
