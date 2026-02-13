import UserForm from "../components/UserForm";

function Register() {
  return <UserForm route="/api/user/create/" method="register" />;
}

export default Register;
