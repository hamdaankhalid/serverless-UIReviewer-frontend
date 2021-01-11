import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewUi.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default function NewUi() {
  const file = useRef(null);
  const history = useHistory();
  const [task, setTask] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return task.length > 0 && link.length > 5;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createUi({ task, link, attachment },);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function createUi(content) {
    return API.post("company-user-interfaces", "/ui", {
      body: content
    });
  }

  return (
    <div className="NewUi">
      <Form onSubmit={handleSubmit}>
      <Form.Label>Describe Task For Reviewer</Form.Label>
        <Form.Group controlId="task">
          <Form.Control
            value={task}
            as="textarea"
            onChange={(e) => setTask(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <Form.Group controlId="link">
          <Form.Label>Link (Page To Review)</Form.Label>
          <Form.Control
            value={link}
            type="url"
            onChange={(e) => setLink(e.target.value)}
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}