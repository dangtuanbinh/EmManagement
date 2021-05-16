//Lớp : Employee
//Chức năng:
/**
 * 1.Thêm nhân viên mới vào danh sách
 * 2.Hiển thị danh sách nhân viên dưới dạng bảng
 * 3.Xóa nhân viên mới vào danh sách
 * 4.Cập nhật thông tin nhân viên
 * 5.Tìm kiếm nhân viên theo tên hoặc theo mã
 * 6.Validate thông tin
 */


//Xây dựng lớp đối tượng
function Employee(lastName, firstName, id, birthday, position) {
  this.lastName = lastName;
  this.firstName = firstName;
  this.id = id;
  this.birthday = birthday;
  this.position = position;
  this.calcSalary = function () {
    //position = "Sếp"
    //position = "Trưởng phòng"
    //position = "Nhân viên"
    if (this.position === "Chief") return 5000;
    if (this.position === "Manager") return 3000;
    return 1000;
  };
}

var employeeList = [];

//function 1: thêm nhân vien
const addEmployee = function () {
  //1.laấy thông tin từ form , dom
  const lastName = document.getElementById("ho").value;
  const firstName = document.getElementById("ten").value;
  const id = document.getElementById("msnv").value;
  const birthday = document.getElementById("datepicker").value;
  const position = document.getElementById("chucvu").value;

  //2.1 Kiểm tra tồn tại nhân viên
  for (var i = 0; i < employeeList.length; i++) {
    if (id === employeeList[i].id) {
      alert("Employee has been added");
      return;
    }
  }

  //2.khởi tạo object, lưu thông lấy đc vào object đó
  const newEmployee = new Employee(lastName, firstName, id, birthday, position);

  //3. bỏ vào mảng employeeList (object nhân viên)
  employeeList.push(newEmployee);
  //Lưu danh sách nhân viên xuống localstorage
  saveData();

  //4. render giao diện mỗi lần add 1 nhân viên
  renderEmployees();
};

// function 2: tạo giao diện bảng nhân viên
const renderEmployees = function () {
  var htmlContent = "";
  for (var i = 0; i < employeeList.length; i++) {
    const currentEmp = employeeList[i];
    htmlContent += `
    <tr> 
      <td>${i + 1}</td> 
      <td>${currentEmp.lastName + " " + currentEmp.firstName}</td> 
      <td>${currentEmp.id}</td> 
      <td>${currentEmp.birthday}</td> 
      <td>${currentEmp.position}</td> 
      <td>${currentEmp.calcSalary()}</td> 
      <td>
        <button 
          class="btn btn-danger" 
          onclick="deleteEmpl('${currentEmp.id}')" 
        >Delete</button> 
        <button class="btn btn-info" onclick="getUpdateEmpl('${
          currentEmp.id
        }')">Update</button>
      </td>
    </tr>`;
  }
  console.log(htmlContent);
  document.getElementById("tbodyEmployees").innerHTML = htmlContent;
};

//function 3: Xóa nhân viên khỏi danh sách
const deleteEmpl = function (id) {
  //input: mã nhân viên
  //process: Tìm vị trí =>  xóa => render giao diện
  const index = findById(id);
  //kiểm tra nếu tìm được thì xóa
  if (index !== -1) {
    employeeList.splice(index, 1);
    renderEmployees();
    // saveData()
  }
};

//function 4: cập nhật thông tin nhân viên

const getUpdateEmpl = function (id) {
  const index = findById(id);
  if (index !== -1) {
    const updateUser = employeeList[index];

    //show thông tin lên form
    document.getElementById("ho").value = updateUser.lastName;
    document.getElementById("ten").value = updateUser.firstName;
    document.getElementById("msnv").value = updateUser.id;
    document.getElementById("datepicker").value = updateUser.birthday;
    document.getElementById("chucvu").value = updateUser.position;

    //disable ô msnv
    document.getElementById("msnv").setAttribute("disabled", true);

    // ẩn nút thêm, hiện nút update
    document.getElementById("btnAdd").style.display = "none";
    document.getElementById("btnUpdate").style.display = "block";
  }
};

const updateUser = function () {
  const lastName = document.getElementById("ho").value;
  const firstName = document.getElementById("ten").value;
  const id = document.getElementById("msnv").value;
  const birthday = document.getElementById("datepicker").value;
  const position = document.getElementById("chucvu").value;

  const updatedEmpl = new Employee(lastName, firstName, id, birthday, position);

  //dựa vào id không đổi, tìm nhân viên cũ nằm ở đâu trong mảng,
  //đè nhân viên mới vào
  const index = findById(id);
  if(index !== -1){
    employeeList[index] = updatedEmpl;
    renderEmployees();
  }
};

//function: tìm vị trí theo id
const findById = function (id) {
  console.log(id);
  for (var i = 0; i < employeeList.length; i++) {
    console.log(id, employeeList[i].id);
    if (employeeList[i].id === id) {
      return i;
    }
  }
  return -1;
};

//function: save data to local storage
const saveData = function () {
  //chuyển sang chuỗi JSON
  const employeeListJSON = JSON.stringify(employeeList);
  console.log(employeeListJSON);
  localStorage.setItem("employees", employeeListJSON);
};

const getData = function () {
  //lúc vào trang,
  /**
   * 1.Xuống dưới local lấy danh sách cũ lên
   * 2.Chuyển từ chuỗi ra mảng (lúc lưu là lưu chuỗi => lấy là lấy chuỗi)
   * 3.gán employeeList = mảng data cũ
   *
   */
  var employeeListJSON = localStorage.getItem("employees");
  //check nếu data cũ có tồn tại, lấy lên gán vào employeeList
  if (employeeListJSON) {
    const employeeListFromLocal = JSON.parse(employeeListJSON);

    for (var i = 0; i < employeeListFromLocal.length; i++) {
      const currentEmp = employeeListFromLocal[i];
      const newEmployee = new Employee(
        currentEmp.lastName,
        currentEmp.firstName,
        currentEmp.id,
        currentEmp.birthday,
        currentEmp.position
      );
      employeeList.push(newEmployee);
    }
    /**
     * 1. viết hàm map:
     * [EMP1, EMP2] => [new Employee(EMP1), new Employee(EMP2)]
     *
     */

    renderEmployees();
  }
};

getData();
