import "./SignIn.css";

export default function SignIn({ onRouteChange }) {
  return (
    <>
      <div className="form-container">
        <div className="sign-in-form">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" placeholder="Enter your email" />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          <button type="submit" onClick={()=>onRouteChange('home')}>
            Sign In
          </button>

          <p id="register" onClick={()=>onRouteChange('register')}>Register</p>
        </div>
      </div>
    </>
  );
}
