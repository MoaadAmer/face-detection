import "./Navigation.css";
export default function Navigation({onRouteChange}) {
  return (
    <nav>
      <button onClick={()=>onRouteChange('signin')}>Sign Out</button>
    </nav>
  );
}
