/**
 * Fetches a Thing Description from a URI using the platform's fetch, which every browser
 * the demo targets ships natively. Replaces axios, whose only remaining use was this call.
 *
 * Two axios behaviours have to be reproduced explicitly, because bare fetch does neither:
 *
 *   - axios sent an Accept header listing application/json ahead of the catch-all, while
 *     fetch sends only the catch-all. TD servers commonly content-negotiate, so without
 *     an Accept header a server that would have returned JSON to axios can hand back HTML
 *     instead and response.json() throws. TD_ACCEPT below asks for the Thing Description
 *     media type first, then plain JSON, then anything.
 *   - axios rejected on a non-2xx status; fetch resolves, so the status is checked here.
 */
const TD_ACCEPT = 'application/td+json, application/json;q=0.9, */*;q=0.8';

export async function fetchData(uri) {
  const response = await fetch(uri, {headers: {Accept: TD_ACCEPT}});
  if (!response.ok) {
    throw new Error(
      `Request to ${uri} failed with ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
