async function loginSubmit() {
  const loginForm = document.getElementById("loginForm");

  const formData = new FormData(loginForm);

  const urlEncoded = new URLSearchParams(formData).toString();

  let response = await fetch(loginForm.action, {
    method: loginForm.method,
    body: urlEncoded,
    headers: {
      "Content-type": loginForm.enctype,
    },
  });

  if (response.ok) {
    window.location.assign("dashboard.html");
  }

  let data = await response.json();
}

async function signUpSubmit() {
  console.log("Ran this");
  const signupForm = document.getElementById("signupForm");

  const formData = new FormData(signupForm);

  const urlEncoded = new URLSearchParams(formData).toString();

  let response = await fetch(signupForm.action, {
    method: signupForm.method,
    body: urlEncoded,
    headers: {
      "Content-type": signupForm.enctype,
    },
  });

  if (response.created) {
    window.location.assign("otp.html");
  }

  let data = await response.json();
}
