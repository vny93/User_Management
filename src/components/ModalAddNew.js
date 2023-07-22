import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { postCreateUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalAddNew = (props) => {
  const { show, handleShow, handleClose, handleUpdateTable } = props; //ben ham App.js truyen props ntn ben nay lay nhu v
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const handleSaveUser = async () => {
    let res = await postCreateUser(name, job);
    console.log("check res:", res);
    if (res && res.id) {
      handleClose();
      setName("");
      setJob("");
      toast.success("Create user success!");
      handleUpdateTable({ first_name: name, id: res.id });
    } else {
      toast.error("Create user fail!");
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Job</label>
              <input
                type="text"
                className="form-control"
                value={job}
                onChange={(event) => setJob(event.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSaveUser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNew;
