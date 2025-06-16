import { useState } from "react";
import "./SignIn.css";
import { useRef } from "react";

export default function SignIn({ onRouteChange, loadUser }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showErrorMessage, setshowErrorMessage] = useState(false);

  async function onSumbitHandler() {
    if (emailRef.current.value !== "" && passwordRef.current.value !== "") {
      try {
        const response = await fetch("http://localhost:3000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }),
        });
        if (!response.ok) {
          setshowErrorMessage(true);
        } else {
          const user = await response.json();
          loadUser(user);
          onRouteChange("home");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setshowErrorMessage(true);
    }
  }

  return (
    <>
      <div className="form-container">
        <div className="sign-in-form">
          <label htmlFor="email">Email:</label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            placeholder="Enter your email"
          />
          <label htmlFor="password">Password:</label>
          <input
            ref={passwordRef}
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          {showErrorMessage ? (
            <p id="error">invalid user or password.please try again</p>
          ) : null}

          <button type="submit" onClick={onSumbitHandler}>
            Sign In
          </button>

          <p id="register" onClick={() => onRouteChange("register")}>
            Register
          </p>
        </div>
      </div>
    </>
  );
}
