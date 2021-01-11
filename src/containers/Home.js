import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

export default function Home() {
  const [uis, setUis] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const uis = await loadUis();
        setUis(uis);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadUis() {
    return API.get("company-user-interfaces", "/ui");
  }

  function renderUisList(notes) {
    return (
      <>
        <LinkContainer to="/ui/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Upload A New UI</span>
          </ListGroup.Item>
        </LinkContainer>
        {uis.map(({ UiId, task, link, createdAt }) => (
          <LinkContainer key={UiId} to={`/ui/${UiId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {task.trim().split("\n")[0]}
              </span>
              <br />
              <span >
                Link: {link.trim().slice(0,5)}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="Home">
      <div className="lander">
        <h1>UI-Pro</h1>
        <p className="text-muted">Everyone calls their design user friendly till the reviews come in....</p>
      </div>
    </div>
    );
  }

  function renderNotes() {
    return (
      <div className="uis">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Uploaded UI's</h2>
        <ListGroup>{!isLoading && renderUisList(uis)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}