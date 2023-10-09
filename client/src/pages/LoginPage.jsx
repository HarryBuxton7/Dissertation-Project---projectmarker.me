import React, { useContext, useState, useRef } from "react";
import loginRequest from "../api/loginRequest";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../App";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ClipLoader } from "react-spinners";

export const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [
    token,
    setToken,
    userID,
    setUserId,
    selectedCohort,
    setSelectedCohort,
    admin,
    setAdmin,
  ] = useContext(TokenContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  // create refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    loginRequest(email, password)
      .then((res) => {
        setToken(res.token);
        setUserId(res.userID);
        setLoading(false);
        if (res.admin == true) {
          console.log(res.admin);
          setAdmin(res.admin);
          navigate("/admin");
        } else if (res.admin == false) {
          console.log(res.admin);
          setAdmin(res.admin);
          navigate("/");
        }
      })
      .catch((err) => {
        setLoading(false);
        setEmailError(true);
        setPasswordError(true);
      });
  };

  const handleEmailKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordRef.current.focus(); // move to password input
    }
  };

  const handleRegister = (e) => {
    navigate("/register");
  };

  return (
    <div>
      <h1>Login</h1>
      <form autoComplete="off" onSubmit={handleLoginSubmit}>
        <TextField
          id="outlined-basic"
          label="Enter Email"
          variant="outlined"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          onKeyDown={handleEmailKeyPress}
          inputRef={emailRef}
          error={emailError}
        />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          label="Enter Password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
          inputRef={passwordRef}
          error={passwordError}
          helperText={passwordError ? "Incorrect email or password" : ""}
          onBlur={() => {
            setPasswordError(false);
            setEmailError(false);
          }}
        />
        <br />
        <br />
        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
      <br />

      <Button variant="contained" onClick={handleRegister}>
        Register Here
      </Button>
      <br></br>
      <br></br>

      {loading && <ClipLoader size={150} />}
    </div>
  );
};
