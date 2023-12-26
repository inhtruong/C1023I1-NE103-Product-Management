class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

// Tạo mảng products và thêm sản phẩm
let products = [
    new Product(1, "MacBook Air 13 inch M1 2020 7-core GPU", 1000),
    new Product(2, "Laptop Dell Vostro 15 3520 i3 1215U", 2000),
    new Product(3, "Laptop Asus TUF Gaming F15 FX506HE i7 11800H", 3000)
];

// tạo object của class Product
let product1 = new Product();
product1.id = 4;
product1.name = "Laptop Dell Vostro 15 3520 i3 1215U";
product1.price = 4000;
// đưa object vào mảng products
products.push(product1);

function displayProducts(products) {
    const productListElement = document.getElementById('listProduct');

    // Xóa danh sách cũ
    productListElement.innerHTML = '';
    productListElement.innerHTML = '<tr>';

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        productListElement.innerHTML += `
            <td class="text-center">${i+1}</td>
            <td class="text-left">${product.name}</td>
            <td class="text-right">${formatCurrency(product.price)} đồng</td>
            <td>
                <button type="button" class="btn-edit" onclick="editProduct(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button type="button" class="btn-delete" onclick="deleteProduct(${i})"><i class="fa-solid fa-trash"></i></button>
            </td>  
        `;
    }
    productListElement.innerHTML += '</tr>';
}

// Thêm sản phẩm
function addProduct() {
    // lấy dữ liệu từ ô input
    let name = document.getElementById('name').value;
    let price = parseFloat(document.getElementById('price').value);
    let id = products.length + 1;

    // Kiểm tra thông tin name và price có bị để trống không?
    if (name && price) {
        // Tạo 1 sản phẩm mới
        // let newProduct = [id, name, price];
        let newProduct = new Product(id, name, price);
        // thêm sản phẩm mới vào mảng products
        products.push(newProduct);
        // Hiển thị lại danh sách products
        displayProductsAndUpdateStorage(products);

        toastr["success"]("Sản phẩm đã được tạo mới thành công");
    } else {
        toastr["warning"]("Vui lòng điền đầy đủ thông tin sản phẩm");
    }
}

// Xoá sản phẩm
function deleteProduct(index) {
    let text = "Bạn có muốn xoá sản phẩm này không?";
    if (confirm(text) == true) {
        // Xoá sản phẩm dựa trên index
        products.splice(index, 1);
    }

    displayProductsAndUpdateStorage(products);   

    toastr["success"]("Sản phẩm đã xoá khỏi danh sách thành công");
}

// Edit sản phẩm
function editProduct(index) {
    // Lay thong tin san pham can sua
    // let productToEdit = products.find(product => product[0] == index);

    let productToEdit;
    for(let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.id == index+1) {
            productToEdit = product;
        }
    }

    if (productToEdit) {
        populateEditForm(productToEdit);
    } else {
        toastr["warning"]("Không tìm thấy sản phẩm để chỉnh sửa");
    }
}

function populateEditForm(product) {
    // set gia tri cua product can edit vao form
    document.getElementById('idProduct').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
}

function updateProduct(idProduct) {
    let editedName = document.getElementById('name').value;
    let editedPrice = document.getElementById('price').value;

    // let index = products.findIndex(product => product[0] == idProduct);
    let index = -1;
    for(let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.id == idProduct) {
            index = i;
        }
    }

    if (index != -1) {
        // Cap nhat thong tin
        products[index].name = editedName;
        products[index].price = editedPrice;

        // show list san pham
        displayProductsAndUpdateStorage(products)

        toastr["success"]("Sản phẩm được thay đổi thành công");
    } else {
        toastr["error"]("Không tìm thấy sản phẩm để cập nhật");
    }
}


// sumbit form
function submitForm() {
    let idProduct = parseInt(document.getElementById('idProduct').value);

    if (idProduct) {
        // Edit san pham
        updateProduct(idProduct);
    } else {
        // Add san pham
        addProduct();
    }   

    document.getElementById("formProduct").reset();
}

function searchProduct() {
    let searchKeyword = document.getElementById('searchProduct').value;
    searchKeyword = searchKeyword.toLowerCase(); //

    let filterList = [];

    for(let i = 0; i < products.length; i++) {
        const productName = products[i].name.toLowerCase();

        if (productName.includes(searchKeyword)) {
            filterList.push(products[i]);
        }
    }

    //
    displayProducts(filterList);
}

// Hàm để lấy danh sách sản phẩm từ localStorage
function getProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('listProd');
    // if (searchProduct) {
    //     return JSON.parse(storedProducts);
    // } else {
    //     return [];
    // }
    return storedProducts ? JSON.parse(storedProducts) : [];
}

// Hàm để cập nhật danh sách sản phẩm trong localStorage
function updateLocalStorage() {
    localStorage.setItem('listProd', JSON.stringify(products));
}

// Hàm để hiển thị sản phẩm và cập nhật localStorage
function displayProductsAndUpdateStorage(products) {
    displayProducts(products);
    updateLocalStorage();
}

// Hàm khởi tạo, gọi khi trang được tải
function init() {
    // Lấy danh sách sản phẩm từ localStorage
    products = getProductsFromLocalStorage();
    // Hiển thị danh sách sản phẩm
    displayProducts(products);
}

function formatCurrency(amount) {
    // Kiểm tra nếu giá trị đầu vào không phải là số
    if (isNaN(amount)) {
        return "Invalid input";
    }

    // Chuyển đổi số thành chuỗi và chia thành các chuỗi con
    const parts = amount.toString().split('.');

    // Thêm dấu phẩy ngăn cách hàng nghìn
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Thêm ký tự đơn vị đồng
    return parts.join(',');
}