import React, { useState } from "react";
import "./Role.css";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Login() {

    return (
        <div className="Home">
      <div className="lander">
      <LinkContainer to="/">
        <Button>Upload Your UI For Review</Button>
        </LinkContainer>
        <br/>
        <br/>
        <LinkContainer to="/review">
        <Button>Review UI's</Button>
        </LinkContainer>
        </div>
    </div>


    );
  }