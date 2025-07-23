import "./Register.css";
import { useRef, useState } from "react";
import { serverUrl } from "../../config.js";

export default function Register({ onRouteChange }) {
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function onSubmitHandler() {
    if (
      name.current.value === "" ||
      email.current.value === "" ||
      password.current.value === ""
    ) {
      setErrorMessage("all field are mandatory");
    } else {
      try {
        const response = await fetch(`${serverUrl}/register`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            name: name.current.value,
            email: email.current.value,
            password: password.current.value,
          }),
        });
        if (!response.ok) {
          console.log(response);
          let responseText = await response.text();
          responseText = responseText.replaceAll('"', "");
          setErrorMessage(responseText);
        } else {
          onRouteChange("home");
        }
      } catch (error) {
        setErrorMessage("could not register, please try again");
        console.error(error);
      }
    }
  }

  return (
    <>
      <div className="form-container">
        <div className="sign-in-form">
          <label htmlFor="email">Name:</label>
          <input
            ref={name}
            type="text"
            id="name"
            placeholder="Enter your name"
          />
          <label htmlFor="email">Email:</label>
          <input
            ref={email}
            type="email"
            id="email"
            placeholder="Enter your email"
          />
          <label htmlFor="password">Password:</label>
          <input
            ref={password}
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          {errorMessage ? <p id="error">{errorMessage}</p> : null}
          <button type="submit" onClick={() => onSubmitHandler()}>
            Register
          </button>
        </div>
      </div>
    </>
  );
}
