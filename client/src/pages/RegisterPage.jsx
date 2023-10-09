import React, { useState, useRef } from "react";
import registerRequest from "../api/registerRequest";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PasswordChecklist from "react-password-checklist";
import { set } from "lodash";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const navigate = useNavigate();

  const passwordInput = useRef(null);
  const emailInput = useRef(null);
  const passwordAgainInput = useRef(null);

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (passwordIsValid) {
      registerRequest(email, password)
        .then(({ res }) => {
          navigate("/login");
        })
        .catch((err) => {
          if (err.message == "Email already exists") {
            setEmailError(true);
            emailInput.current.focus();
          }
        });
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form autoComplete="off" onSubmit={handlePasswordSubmit}>
        <TextField
          id="outlined-basic"
          label="Enter New Email"
          variant="outlined"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              passwordInput.current.focus(); // move to password input
            }
          }}
          type="email"
          value={email}
          inputRef={emailInput}
          error={emailError}
          helperText={emailError ? "Email is invalid" : ""}
        />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          label="Enter New Password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              passwordAgainInput.current.focus(); // move to password input
            }
          }}
          type="password"
          value={password}
          error={passwordError}
          inputRef={passwordInput}
        />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          label="Enter New Password"
          variant="outlined"
          onChange={(e) => {
            setPasswordError(false);
            setPasswordAgain(e.target.value);
          }}
          type="password"
          value={passwordAgain}
          error={passwordError}
          inputRef={passwordAgainInput}
          helperText={passwordError ? "Password is invalid" : ""}
          onBlur={() => {
            setPasswordError(false);
          }}
        />
        <br />
        <br />
        <PasswordChecklist
          rules={["number", "match"]}
          minLength={1}
          value={password}
          valueAgain={passwordAgain}
          onChange={(validity) => {
            setPasswordIsValid(validity);
          }}
          messages={{
            minLength: "Password has at least 8 characters.",
            number: "Password has a number.",
            capital: "Password has  a capital letter.",
            match: "Passwords match.",
          }}
        />
        <Button variant="contained" type="submit">
          Register
        </Button>
      </form>

      <form></form>
    </div>
  );
};
