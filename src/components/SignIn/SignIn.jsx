import "./SignIn.css";

export default function SignIn({signInClickHandler}) {
  return (
    <>
      <form id="signinForm">
        <h2>Sign In</h2>
        <div>
          <label for="email"></label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label for="password"></label>
          <input type="password" id="password" name="password" />
        </div>
        <div>
          <input type="submit" id="submit" onClick={()=>signInClickHandler('home')}/>
        </div>
      </form>
    </>
  );
}
