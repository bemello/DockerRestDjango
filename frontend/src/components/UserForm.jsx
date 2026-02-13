import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../utils/constants";

function UserForm({ route, method, setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const methodName = method === "login" ? "Login" : "Register";

  function getUserProfile(setUser) {
    api
      .get("/api/user/me")
      .then(function (response) {
        const user = {
          email: response.data.email,
          profile_picture: response.data.profile_picture,
        };
        setUser(user);
      })
      .catch((err) => alert(err));
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      if (method === "login") {
        const res = await api.post(
          route,
          { email, password },
          { headers: { "content-type": "application/json" } },
        );
        localStorage.setItem(ACCESS_TOKEN, res.data.token);
        getUserProfile(setUser);
        navigate("/");
      } else {
        await api.post(
          route,
          { email, password, name },
          { headers: { "content-type": "application/json" } },
        );
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-25">
        <div className="d-flex justify-content-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="150"
            fill="#929f79"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
        </div>
        <div className="default-form">
          <form onSubmit={handleSubmit} id="form" method="post">
            {methodName === "Register" && (
              <>
                <div className="form-floating mb-3 mt-3">
                  <input
                    id="name"
                    className="form-control"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <label for="name">Name</label>
                </div>
              </>
            )}

            <div className="form-floating mb-3 mt-3">
              <input
                id="email"
                className="form-control"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
              <label for="email">Email</label>
            </div>
            <div className="form-floating mt-3 mb-3">
              <input
                id="pwd"
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <label for="pwd">Password</label>
            </div>
          </form>
          <div className="d-grid gap-2">
            <button
              type="submit"
              form="form"
              className="btn btn-lg btn-default"
            >
              {methodName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
