import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Ui.css";
import { s3Upload } from "../libs/awsLib";

export default function Ui() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [ui, setUi] = useState(null);
  const [task, setTask] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadUi() {
      return API.get("company-user-interfaces", `/ui/${id}`);
    }

    async function onLoad() {
      try {
        const ui = await loadUi();
        console.log(ui)
        const { task, link, attachment } = ui;

        if (attachment) {
          ui.attachmentURL = await Storage.vault.get(attachment);
        }

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
    return task.length > 0 && link.length > 5;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveUi(final) {
    return API.put("company-user-interfaces", `/ui/${id}`, {
      body: final
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
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
        if (file.current) {
          attachment = await s3Upload(file.current);
        }
        console.log(task, link, attachment);
        await saveUi({
          task,
          link,
          attachment: attachment || ui.attachment || null
        });
        history.push("/");
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }

  }
  
  function deleteNote() {
    return API.del("company-user-interfaces", `/ui/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Ui">
      {ui && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="task">
            <Form.Control
              as="textarea"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            </Form.Group>
          <Form.Group controlId="link">
            <Form.Control
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {ui.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={ui.attachmentURL}
                >
                  {formatFilename(ui.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}