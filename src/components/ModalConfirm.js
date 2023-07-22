import { Modal, Button } from "react-bootstrap";
import { deleteUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalConfirm = (props) => {
  const {
    show,
    handleShow,
    handleClose,
    dataUserDelette,
    handleDeleteUserFromModal,
  } = props; //ben ham App.js truyen props ntn ben nay lay nhu v

  const confirmDelete = async () => {
    let res = await deleteUser(dataUserDelette.id);
    if (res && +res.statusCode === 204) {
      toast.success("Delete user successfully");
      handleDeleteUserFromModal(dataUserDelette);
    } else {
      toast.error("Delete user failed");
    }
    handleClose();
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
          <Modal.Title>
            Delete <area shape="" coords="" href="" alt="" /> user
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            Do you want to delete this user?
            <br />
            <b>email = {dataUserDelette.email} </b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalConfirm;
