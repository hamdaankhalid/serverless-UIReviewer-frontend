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
        console.log(uis)
        setUis(uis);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadUis() {
    return API.get("company-user-interfaces", "/ui/all");
  }

  function renderUisList(notes) {
    const listItems = uis.map((d) => 
          <LinkContainer key={d.UiId} to={`/review/${d.UiId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {d.task}
              </span>
              <br />
              <span >
                Link: {d.link}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(d.createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
    );

    return (
      <>
        {listItems }
      </>
    );
  }


  function renderUi() {
    return (
      <div className="uis">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Review UI's</h2>
        <ListGroup>{!isLoading && renderUisList(uis)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {renderUi()}
    </div>
  );
}