const SCRIPT_SRC = "https://connect.facebook.net/en_US/sdk.js";
const SDK_VERSION = "v19.0";

let loadPromise: Promise<void> | null = null;

/** Loads the Facebook JS SDK once (via the classic `fbAsyncInit` handshake)
 * and initializes it for `appId`. Safe to call from multiple components. */
function loadFacebookSdk(appId: string): Promise<void> {
  if (window.FB) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      window.FB!.init({ appId, cookie: true, xfbml: false, version: SDK_VERSION });
      resolve();
    };

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Facebook SDK script"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** Opens Facebook's login popup and resolves with an access token. The token
 * is later verified server-side (debug_token + /me) — see
 * apps/auth/src/auth/social-verifier.service.ts in sofilm_backend. */
export async function requestFacebookAccessToken(appId: string): Promise<string> {
  await loadFacebookSdk(appId);

  return new Promise((resolve, reject) => {
    window.FB!.login((response) => {
      if (response.status !== "connected" || !response.authResponse) {
        reject(new Error("Facebook login was cancelled or denied"));
        return;
      }
      resolve(response.authResponse.accessToken);
    }, { scope: "public_profile,email" });
  });
}
