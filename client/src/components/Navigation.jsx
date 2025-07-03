import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/deposits/">Deposits</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;