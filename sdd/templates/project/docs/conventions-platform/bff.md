# BFF: server handlers that forward, not decide

**Rule in one line:** a console module's `server/` handlers are the browser's only way to its API — each
forwards one request through the app's BFF, checked for origin, carrying the browser's identity and passing
the API's answer through; only a handler that must hold the session or redirect the browser shapes its
response, and says why.

## Rules

1. **A handler forwards through the app's BFF.** It names the API path, the method and the query it passes
   on — the request's body the BFF reads and forwards itself, once the origin is checked — and calls the
   authenticated BFF proxy — the session's token attached, refreshed once on a 401 (never on the api's
   `account_disabled` or `role_not_allowed`: no refresh lifts either, so it passes through) — or, for a route
   the API serves unguarded, the public one. It holds no rule and no token of its own — a size bound a handler hands
   in is the API's own cap, not a rule of the BFF's (its code, timing and source under "In this repo"); the browser
   never sees a token.
2. **A write is same-origin or refused.** A state-changing request (`POST` · `PUT` · `PATCH` · `DELETE`)
   must carry an `Origin` or `Referer` of the BFF's own origin, or it is answered 403 before anything is
   forwarded. The exemptions are legs that legitimately arrive cross-site, and each says what protects it
   instead: a provider's return (the API's single-use `state`, bound to the browser that started the sign-in by
   the start leg's state cookie), and a navigation leg — a top-level GET from another of the platform's
   addresses, the browser itself writing nothing — whose upstream call is the session's own and whose redirect
   goes only to a fixed address of the platform's (an authenticated application handover). A navigation leg skips the origin
   check only for the browser's GET — reached by any other method, it is asked its origin like every write.
3. **The browser's identity is forwarded.** The upstream call is the server's, so every forwarded request
   carries the browser's user-agent and client address; without them every session the API records reads as
   the BFF itself.
4. **The API's answer passes through.** Its status and its JSON body are returned verbatim — the standard
   error body included — so the console reads every refusal the same way ([screens](screens.md) rule 5). A
   `204` stays bodiless; a redirect keeps its `Location`. A handler may opt into binary successes with
   `response: 'binary'`: a successful reply passes its bytes and only `Content-Type`, `Content-Length` and
   `Content-Disposition` through. Refusals still use the JSON path and the usual authenticated refresh flow.
   Otherwise a non-JSON upstream reply is passed on in the standard error shape (code `upstream`), an
   unreachable API is a 502 and one past the BFF's deadline a 504
   (`upstream_unavailable`).
5. **A handler shapes its response only where the session or the browser requires it**, and a comment says
   why:
   - a leg that **mints the session** (a login, a provider sign-in or its return) reads the API's tokens
     into the server-held session and answers the browser with its cookie, never the tokens;
   - login translates the API's `totp_required` refusal into an answer whose `requiresTwoFactor` is set, so the face
     never parses an upstream code for its second step;
   - the provider start sets the state cookie — the `state` of the API's redirect to the provider, httpOnly,
     SameSite=Lax (the provider's return is a top-level cross-site GET), scoped to the callback's path and living
     as long as the API's state — and the provider callback refuses a return whose `state` is not that cookie's
     (missing or different: another browser's return, a login CSRF) without calling the API, leaving the browser's
     own cookie in place — the cookie is cleared on every answer once the API was called;
   - the provider callback answers a redirect — into the console on success, back to the login with the API's
     `code` and message on a failure (`invalid_state` for its own refusal) — because the browser arrived by
     navigation, not by a fetch;
   - logout revokes by the session's refresh token and drops the local session once the API takes the revoke; a
     revoke the API refuses or never answers, or a session storage outage before the revoke, leaves the platform
     session live, so it is answered as it came and the local session and its cookie are kept for the browser to sign
     out again;
   - an authenticated application handover validates its one-time input, resolves the signed-in
     session and redirects only to its configured application address. A missing or invalid handover
     input follows the application's declared refusal or restart flow.


## Why

A BFF that decides becomes a second API with its own rules and its own refusals, and the console then has
two error dialects to read. Forwarding verbatim keeps the API the only place a rule lives and the standard
body the only error shape; the origin check and the forwarded identity are the two things the server-side
hop would otherwise lose.

## How to apply

- A new handler is a BFF proxy call; one that parses or rewrites the API's body needs a stated reason from
  rule 5, or it becomes a BFF proxy call.
- A handler that calls the API with `fetch` goes through the BFF's helpers instead, which keep the origin check and
  the client headers.
- A refusal the BFF invents (other than the origin check, an unreachable API or session storage, and the size bound
  a handler hands in — the API's own cap, rule 1) is a rule that belongs in the API.
