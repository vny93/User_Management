import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddnew";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import _, { debounce } from "lodash";
import "./TableUsers.scss";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);

  const [dataUserEdit, setDataUserEdit] = useState({});
  const [dataUserDelette, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const [dataExport, setDataExport] = useState([]);

  //const[keyword, setKeyword] = useState(""); //khi nao sd button search thi su state nay, con minh dang search nhung' nen kh can

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUserFromModal = (user) => {
    // let cloneListUsers = [...listUsers]; //tao 1 bien moi de co the update user moi vi th listUsers la 1 bien const (hang so) nen ko the update
    let cloneListUsers = _.cloneDeep(listUsers); //de bien cloneListUsers tro~ toi bo nho khac, neu kh co thi` no' se luu cung bo nho voi listUsers
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUsers[index].first_name = user.first_name;
    setListUsers(cloneListUsers);
    //phai xu li nhu tren vi api update cua ngta kh luu vao DB
    //thuc te khi lam voi api luu vao DB thi chi can call api get list lai la` xong
  };

  const handleDeleteUserFromModal = (user) => {
    //trong thuc te chi can call api get list lai la` xong
    //vi api free nay kh luu vao DB
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = cloneListUsers.filter((item) => item.id !== user.id);
    setListUsers(cloneListUsers);
  };

  useEffect(() => {
    //giong ham componentDidMount
    //call api
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setTotalUsers(res.total);
      setTotalPage(res.total_pages);
      setListUsers(res.data); //dang le~ se~ la` res.data.data nhung o day chi can res.data thui vi da custom axios roi
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleEdtiUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    console.log(term);
    if (term) {
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter((item) =>
        item.email.includes(term)
      );
      setListUsers(cloneListUsers); //neu setList nay thi` khi minh search kq kh co' thi` listUsers dc gan' = rong, nen khi minh search lai thi` no' se~ ko tim dc
      //do minh` kh co' api de call, sau nay chi can call api va` search thui la` dc
    } else {
      getUsers(1);
    }
  }, 500); //sd debounce de kh bi goi api lien tuc khi search, 500ms goi 1 lan

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["ID", "Email", "First Name", "Last Name"]);
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0]; //vi ban chat file la 1 array nen khi ta upload 1 file thi` lay file[0]

      if (file.type !== "text/csv") {
        toast.error("Only accept csv file...");
        return;
      }

      // Parse local CSV file
      Papa.parse(file, {
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              //ep' ngta truyen dinh dang file nhu y' minh`
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format header csv file!");
              } else {
                let result = [];
                rawCSV.map((item, index) => {
                  if (index > 0 && item.length == 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                setListUsers(result);
                console.log("check result:", result);
              }
            } else {
              toast.error("Wrong format csv file!");
            }
          } else toast.error("Not found data on CSV file!");
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b>List Users:</b>
        </span>

        <div className="group-btns">
          <label htmlFor="test" className="btn btn-warning">
            <i className="fa-solid fa-file-import" />&nbsp;Import
          </label>
          <input
            id="test"
            type="file"
            hidden
            onChange={(event) => handleImportCSV(event)}
          />
          <CSVLink
            className="btn btn-primary"
            filename={"users.csv"}
            data={dataExport}
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            {" "}
            <i className="fa-solid fa-file-arrow-down" />&nbsp;Export
          </CSVLink>

          <button
            className="btn btn-success"
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus" /> Add new
          </button>
        </div>
      </div>
      <div className="col-4 my-3">
        <input
          className="form-control"
          placeholder="Search user by email..."
          //value={keyword}
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span>ID</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down"
                    onClick={() => handleSort("desc", "id")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up"
                    onClick={() => handleSort("asc", "id")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Email</th>
            <th>
              <div className="sort-header">
                <span>First Name</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down"
                    onClick={() => handleSort("desc", "first_name")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up"
                    onClick={() => handleSort("asc", "first_name")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item, index) => {
              return (
                <tr key={`users-${index}`}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      className="btn btn-warning mx-4"
                      onClick={() => handleEdtiUser(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {/* phan trang */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPage}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        nextClassName="page-item"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />{" "}
      {/* sd arrow funtion de kh bi loop vo han */}
      {/* do ban chat funtion cua th react moi lan render lai la no' moi' toanh nhu chua update nen no render lien tuc   */}
      <ModalEditUser
        show={isShowModalEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserFromModal={handleEditUserFromModal}
      />
      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelette={dataUserDelette}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};

export default TableUsers;
