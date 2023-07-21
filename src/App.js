import { useState } from "react";
import "./App.scss";
import Header from "./components/Header";
import ModalAddNew from "./components/ModalAddNew";
import TableUsers from "./components/TableUsers";
import Container from "react-bootstrap/Container";

function App() {
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const handleClose = () => {
    setIsShowModalAddNew(false);
  };

  return (
    <div className="app-container">
      <Header />
      <Container>
        <div className="my-3 add-new">
          <span>
            <b>List Users:</b>
          </span>
          <button
            className="btn btn-success"
            onClick={() => setIsShowModalAddNew(true)}
          >
            Add new user
          </button>
        </div>
        <TableUsers />
      </Container>
      <ModalAddNew show={isShowModalAddNew} handleClose={handleClose} />{" "}
      {/* sd arrow funtion de kh bi loop vo han */}
      {/* do ban chat funtion cua th react moi lan render lai la no' moi' toanh nhu chua update nen no render lien tuc   */}
    </div>
  );
}

export default App;
