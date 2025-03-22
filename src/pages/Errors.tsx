import { NavLink } from 'react-router-dom';

export type ErrorProps = {};

export function Errors(props: ErrorProps) {
  const {} = props;

  return (
    <div>
      <p>This Site contains Error</p>
      <NavLink to="/" className="bg-amber-200">
        Go to Home
      </NavLink>
    </div>
  );
}
