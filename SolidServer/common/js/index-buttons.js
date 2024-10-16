'use strict'

const keyname = 'SolidServerRootRedirectLink'

// Removed 'register' function if it's not used
// If it's necessary, make sure it's used somewhere in the code
// function register () {
//   alert(2); window.location.href = '/register'
// }

document.addEventListener('DOMContentLoaded', async function () {
  // Define 'UI' properly
  const UI = window.UI || {} // Replace with the correct import if available
  const authn = UI.authn
  const authSession = UI.authn.authSession

  // Check if 'alert' is defined, replace if necessary
  // const alert = window.alert // Ensure 'alert' is defined

  if (!authn.currentUser()) await authn.checkUser()
  const user = authn.currentUser()

  // IF LOGGED IN: SET SolidServerRootRedirectLink. LOGOUT
  if (user) {
    window.localStorage.setItem(keyname, user.uri)
    await authSession.logout()
  } else {
    const webId = window.localStorage.getItem(keyname)

    // IF NOT LOGGED IN AND COOKIE EXISTS: REMOVE COOKIE, HIDE WELCOME, SHOW LINK TO PROFILE
    if (webId) {
      window.localStorage.removeItem(keyname)
      document.getElementById('loggedIn').style.display = 'block'
      document.getElementById('loggedIn').innerHTML = `<p>Your WebID is : <a href="${webId}">${webId}</a>.</p> <p>Visit your profile to log into your Pod.</p>`
    } else {
      // IF NOT LOGGED IN AND COOKIE DOES NOT EXIST
      // SHOW WELCOME, SHOW LOGIN BUTTON
      // HIDE LOGIN BUTTON, ADD REGISTER BUTTON
      const loginArea = document.getElementById('loginStatusArea')
      const html = '<input type="button" onclick="window.location.href=\'/register\'" value="Register to get a Pod" class="register-button">'
      const span = document.createElement('span')
      span.innerHTML = html
      loginArea.appendChild(span)
      loginArea.appendChild(UI.login.loginStatusBox(document, null, {}))
      const logInButton = loginArea.querySelectorAll('input')[1]
      logInButton.value = 'Log in to see your WebID'
      const signUpButton = loginArea.querySelectorAll('input')[2]
      signUpButton.style.display = 'none'
    }
  }
})
