import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../utils/api";
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
          name: response.data.name,
          email: response.data.email,
          profile_picture: response.data.profile_picture,
          access_history: response.data.access_history,
        };
        setUser(user);
      })
      .catch((err) => console.log(err));
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log(tokenResponse);
        const res = await api.post(
          "/api/user/google/",
          {
            access_token: JSON.stringify(tokenResponse.access_token),
          },
          { headers: { "content-type": "application/json" } },
        );
        localStorage.setItem(ACCESS_TOKEN, res.data.key);
        getUserProfile(setUser);
        navigate("/");
      } catch (error) {
        console.log(error.response.data);
      } finally {
        setLoading(false);
      }
    },
    onError: () => console.log("Login Failed"),
  });

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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16">
      <div className="space-y-12 bg-base-background p-10 md:p-12 rounded-[3rem] shadow-xl shadow-primary/5 border border-primary/5">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="150"
            fill="var(--color-accent)"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
        </div>
        <form onSubmit={handleSubmit} id="form" method="post">
          <div className="space-y-8">
            {methodName === "Register" && (
              <div>
                <label className="block text-[11px] font-bold mb-2 uppercase tracking-[0.25em] text-slate-400">
                  Name
                </label>
                <input
                  className="w-full bg-primary border-transparent shadow-lg rounded-2xl px-3 py-3 outline-none transition-all text-slate-600"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold mb-2 uppercase tracking-[0.25em] text-slate-400">
                E-mail
              </label>
              <input
                className="w-full bg-primary border-transparent shadow-lg rounded-2xl px-3 py-3 outline-none transition-all text-slate-600"
                placeholder="Enter your email..."
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-2 uppercase tracking-[0.25em] text-slate-400">
                Password
              </label>
              <input
                className="w-full bg-primary border-transparent shadow-lg rounded-2xl px-3 py-3 outline-none transition-all text-slate-600"
                placeholder="Enter your password..."
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                form="form"
                className="px-6 py-3 bg-primary text-deep-navy rounded-2xl hover:bg-primary/80 transition-colors"
              >
                {methodName}
              </button>
            </div>
            <div className="grid grid-cols-3 items-center justify-center">
              <div className="w-full h-px bg-primary"></div>
              <span className="text-center">or</span>
              <div className="w-full h-px bg-primary"></div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => googleLogin()}
                className="group p-3 border-2 border-primary rounded-2xl text-primary rounded-2xl hover:bg-primary/80 hover:text-deep-navy transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  width="24"
                  height="24"
                  className="fill-primary border-2 border-primary rounded-full p-1 group-hover:fill-deep-navy group-hover:border-deep-navy transition-colors"
                >
                  {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--> */}
                  <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
