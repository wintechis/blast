
const fileClient = new SolidFileClient(solid.auth, { enableLogging: true })
var loggedIn;

solid.auth.trackSession(session => {
    if (!session) {
        loggedIn = false;
    } else {
        loggedIn = true;
    }
})

async function popupLogin() {
    let session = await solid.auth.currentSession();
    let popupUri = 'solid-popup.html';
    if (!session)
        session = await solid.auth.popupLogin({ popupUri });
    alert(`Logged in as ${session.webId}`);
}

function logout() {
    solid.auth.logout();
}
