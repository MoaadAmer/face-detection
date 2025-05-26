import "./Register.css";

export default function Register({ onRouteChange }) {
  return (
    <>
      <div className="form-container">
        <div className="sign-in-form">
          <label htmlFor="email">Name:</label>
          <input type="text" id="name" placeholder="Enter your name" />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" placeholder="Enter your email" />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          <button type="submit" onClick={()=>onRouteChange('home')}>
            Register
          </button>
        </div>
      </div>
    </>
  );
}
