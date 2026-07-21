const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let loadPromise: Promise<void> | null = null;

/** Loads the Google Identity Services script once and resolves when
 * `window.google.accounts.oauth2` is ready to use. Safe to call from
 * multiple components — subsequent calls reuse the same in-flight/settled
 * promise instead of injecting the script again. */
export function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts.oauth2) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Identity Services script"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** Opens Google's OAuth consent popup and resolves with an access token. The
 * token is later verified server-side (audience + userinfo) — see
 * apps/auth/src/auth/social-verifier.service.ts in sofilm_backend. */
export async function requestGoogleAccessToken(clientId: string): Promise<string> {
  await loadGoogleIdentityScript();

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error_description ?? response.error ?? "Google login failed"));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (error) => reject(new Error(error.type)),
    });
    client.requestAccessToken();
  });
}
