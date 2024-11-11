import React, { useState, useContext } from "react";
import styled from "styled-components";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "../../shared/context/auth-context";
import { AuthContext } from "../../shared/context/auth-context";

const Authenticate = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      pwd: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log(formState.inputs); // This will give you the current form state
    auth.login();
  };

  const switchModeHandler = (event) => {
    if (isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    } else {
      setFormData(
        {
          email: formState.inputs.email,
          pwd: formState.inputs.pwd,
        },
        formState.inputs.email.isValid && formState.inputs.pwd.isValid
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <AuthContainer>
      <AuthHeader>{isLoginMode ? "Login" : "Sign Up"}</AuthHeader>
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter your name."
            onInput={inputHandler}
          />
        )}
        <Input
          id="email"
          element="input"
          type="email"
          label="Email"
          validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="pwd"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGN UP"}
        </Button>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </form>
    </AuthContainer>
  );
};

export default Authenticate;

// Styled Components
const AuthContainer = styled.div`
  width: 90%;
  max-width: 25rem;
  margin: 7rem auto;
  text-align: center;
  background-color: #f4f4f4;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 5rem auto;
  }
`;

const AuthHeader = styled.h2`
  color: white;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;
