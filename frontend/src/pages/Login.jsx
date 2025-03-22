import Form from "../components/Form";
import "../styles/pages/Login.css";

function Login() {
  return <Form route="/api/token/" method="login" />;
}

export default Login;
