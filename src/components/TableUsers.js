import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddnew";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import _, { debounce } from "lodash";
import "./TableUsers.scss";

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
    setSortBy(sortBy)
    setSortField(sortField)
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers)
  }

  const handleSearch = debounce((event) => {
     let term = event.target.value;
     console.log(term);
     if(term){
      console.log("vo 1");
      console.log("term",term);
        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = cloneListUsers.filter((item) => item.email.includes(term));
        setListUsers(cloneListUsers);//neu setList nay thi` khi minh search kq kh co' thi` listUsers dc gan' = rong, nen khi minh search lai thi` no' se~ ko tim dc
      //do minh` kh co' api de call, sau nay chi can call api va` search thui la` dc
      }else{
      console.log("vo 2");
      getUsers(1);
     }
  },500) //sd debounce de kh bi goi api lien tuc khi search, 500ms goi 1 lan

  return (
    <>
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
      <div className="col-4 my-3">
        <input className="form-control"
        placeholder="Search user by email..."
        //value={keyword}
        onChange={(event) => handleSearch(event)}/>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span>ID</span>
                <span>
                  <i className="fa-solid fa-arrow-down"
                  onClick={()=> handleSort("desc","id")}>

                  </i>
                  <i className="fa-solid fa-arrow-up"
                  onClick={()=> handleSort("asc","id")}></i>
                </span>
              </div>
            </th>
            <th>Email</th>
            <th>
              <div className="sort-header">
                <span>First Name</span>
                <span>
                  <i className="fa-solid fa-arrow-down"
                  onClick={()=> handleSort("desc","first_name")}>

                  </i>
                  <i className="fa-solid fa-arrow-up"
                  onClick={()=> handleSort("asc","first_name")}></i>
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
