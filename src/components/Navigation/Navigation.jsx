import "./Navigation.css";
export default function Navigation({signOutHandler}) {
  return (
    <nav>
      <button onClick={()=>signOutHandler('signin')}>Sign Out</button>
    </nav>
  );
}
