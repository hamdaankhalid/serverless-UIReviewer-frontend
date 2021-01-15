import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewUi.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default function NewUi() {
  const history = useHistory();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const [ui, setUi] = useState(null);
  const [task, setTask] = useState("");
  const [link, setLink] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadUi() {
      return API.get("company-user-interfaces", `/ui/any/${id}`);
    }

    async function onLoad() {
      try {
        
        const ui = await loadUi();
        
        const { ComapnyId, id, attachment, createdAt, link, task } = ui[0];
        console.log(ui[0])
        // if (attachment) {
        //   ui.attachmentURL = await Storage.vault.get(attachment);
        // }

        setTask(task);

        setLink(link);
        setUi(ui);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return text.length > 0;
  }


  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
    const WebcamVideo = "demoVid";
    const ScreenRecordVideo = "demoScreenVid";
      await createReview({ WebcamVideo, ScreenRecordVideo, text },);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function createReview(content) {
    return API.post("reviewer-service", "/review", {
      body: content
    });
  }



  return (
    <div className="NewUi">
    <br/>
    <Form.Label> <b>Task To Complete:</b></Form.Label>
      <br/>
      <Form.Label> <b>{task}</b></Form.Label>
    <br/>
    <iframe src={link} height="700px" width="100%" title="UI in IFRAME"></iframe>
    <br/>
    <br/>
      <Form onSubmit={handleSubmit}>
      <Form.Label> <b>Write your review below:</b></Form.Label>
      <br/>
      
        <Form.Group controlId="text">
          <Form.Control
            value={text}
            as="textarea"
            onChange={(e) => setText(e.target.value)}
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