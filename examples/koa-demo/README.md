# jwks-rsa - Koa Example

The `jwks-rsa` library provides a small helper that makes it easy to configure `koa-jwt` with the `RS256` algorithm. Using `koaJwt2Key` you can generate a secret provider that will provide the right signing key to `koa-jwt` based on the `kid` in the JWT header.

```js
const Koa = require('koa');
const jwt = require('koa-jwt');
const jwksRsa = require('jwks-rsa');

...

// Initialize the app.
const app = new Koa();
app.use(jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.koaJwt2Key({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://my-authz-server/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'urn:my-resource-server',
  issuer: 'https://my-authz-server/',
  algorithms: [ 'RS256' ]
}));
```
