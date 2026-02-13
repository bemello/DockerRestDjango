import UserForm from "../components/UserForm";

function Login({ setUser }) {
  return (
    <UserForm route="/api/user/token/" method="login" setUser={setUser} />
  );
}

export default Login;
