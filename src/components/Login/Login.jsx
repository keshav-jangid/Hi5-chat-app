import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets.js";
import { Signup, LogIn } from "../../config/Firebase.js";
const Login = () => {
  const [currentstate, setcurentstate] = useState("Login");
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onSubmitHnadler = (event) => {
    event.preventDefault();
    if (currentstate === "SignUp") {
      console.log(Username, Email, Password);
      Signup(Username, Email, Password);
    } else {
      LogIn(Email, Password);
    }
  };

  return (
    <div className="login">
      <div>
        <img src={assets.logo2} alt="" className="logo" />
      </div>
      <form onSubmit={onSubmitHnadler} className="loginform">
        <h2>{currentstate === "SignUp" ? "SignUp" : "Login"}</h2>
        {currentstate === "SignUp" ? (
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={Username}
            type="text"
            placeholder="username"
            className="input-field"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={Email}
          type="Email"
          placeholder="Email"
          className="input-field"
          required
          minLength={6}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={Password}
          type="password"
          placeholder="Password"
          className="input-field"
          required
          minLength={6}
        />
        <button type="submit">
          {currentstate === "SignUp" ? "Create Account" : "Login"}
        </button>
        {currentstate === "SignUp" ? (
          <div className="loginform-aggrement">
            <input type="checkbox" name="" id="" required />
            <p>agree to terms of use and privacy policy .</p>
          </div>
        ) : null}
        <div className="login-forgot">
          {currentstate === "SignUp" ? (
            <p className="login-toggle">
              already have an account?
              <span onClick={() => setcurentstate("Login")}>
                {currentstate === "SignUp" ? "Login" : "Register"}
              </span>
            </p>
          ) : (
            <p className="login-toggle">
              create new account.{" "}
              <span onClick={() => setcurentstate("SignUp")}>
                {currentstate === "SignUp" ? "Login" : "SignUp"}
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
