function searchSensorData() {
    var keyword = document.getElementById('searchKeyword').value;
    var sensorType = document.getElementById('sensorType').value;
    var pageSize = document.getElementById('pageSize').value;

    var sortField = new URLSearchParams(window.location.search).get('sortField') || 'id';
    var sortDir = new URLSearchParams(window.location.search).get('sortDir') || 'asc';

    // Tạo URL với từ khóa tìm kiếm và các tham số khác
    var url = '/dataSensor?searchKeyword=' + encodeURIComponent(keyword) +
        '&sensorType=' + encodeURIComponent(sensorType) +
        '&size=' + encodeURIComponent(pageSize) +
        '&sortField=' + encodeURIComponent(sortField) +
        '&sortDir=' + encodeURIComponent(sortDir);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText, 'text/html');

            var newTableBody = doc.querySelector('.datatable tbody');
            if (newTableBody) {
                document.querySelector('.datatable tbody').innerHTML = newTableBody.innerHTML;
            }

            var newPagination = doc.querySelector('.pagination');
            if (newPagination) {
                document.querySelector('.pagination').innerHTML = newPagination.innerHTML;
            }
        }
    };
    xhr.send();
}


window.onscroll = function() {
  let backToTopButton = document.getElementById('back-to-top');
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
};

// Cuộn lên đầu trang khi bấm nút
document.getElementById('back-to-top').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'  // Cuộn mượt mà
  });
});


function changePageSize() {
    const size = document.getElementById('pageSize').value;
    const searchKeyword = document.getElementById('searchKeyword').value;
    const sensorType = document.getElementById('sensorType').value;

    // Lấy giá trị sort hiện tại từ URL
    const sortField = new URLSearchParams(window.location.search).get('sortField') || 'id';
    const sortDir = new URLSearchParams(window.location.search).get('sortDir') || 'asc';

    // Chuyển hướng với các tham số cần thiết
    window.location.href = `/dataSensor?size=${size}&page=0&searchKeyword=${encodeURIComponent(searchKeyword)}&sensorType=${sensorType}&sortField=${sortField}&sortDir=${sortDir}`;
}

function changeSensorType() {
    const sensorType = document.getElementById('sensorType').value;
    const searchKeyword = document.getElementById('searchKeyword').value;
    const pageSize = document.getElementById('pageSize').value;

    // Lấy giá trị sort hiện tại từ URL
    const sortField = new URLSearchParams(window.location.search).get('sortField') || 'id';
    const sortDir = new URLSearchParams(window.location.search).get('sortDir') || 'asc';

    // Chuyển hướng với các tham số cần thiết
    window.location.href = `/dataSensor?sensorType=${sensorType}&searchKeyword=${encodeURIComponent(searchKeyword)}&size=${pageSize}&page=0&sortField=${sortField}&sortDir=${sortDir}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    function fetchBuiCount() {
        // Gọi API để lấy số lần độ bụi > 80
        fetch(`/bui-count`)
            .then(response => response.json())
            .then(count => {
                // Hiển thị số lần độ bụi > 80
                document.getElementById("bui-count").innerHTML = `${count}`;
            })
            .catch(error => {
                console.error('Error fetching bui count:', error);
                document.getElementById('bui-count').textContent = 'N/A'; // Hiển thị 'N/A' nếu có lỗi
            });
    }

    function fetchTopBui() {
        fetch('/bui-list-data') // Gọi API để lấy danh sách độ bụi cao nhất
            .then(response => response.json()) // Chuyển đổi phản hồi thành JSON
            .then(data => {
                const buiListElement = document.getElementById('bui-list');
                buiListElement.innerHTML = ''; // Xóa danh sách cũ

                // Giả sử data là mảng chứa các giá trị độ bụi
                data.forEach(bui => {
                    const li = document.createElement('li'); // Tạo một phần tử <li>
                    li.textContent = `Độ bụi: ${bui}`; // Hiển thị độ bụi
                    buiListElement.appendChild(li); // Thêm <li> vào <ul>
                });
            })
            .catch(error => {
                console.error('Error fetching top bui list:', error); // In lỗi nếu có
            });
    }

    fetchTopBui();

    // Gọi hàm để cập nhật dữ liệu ban đầu khi trang được tải
    fetchBuiCount();

    setInterval(fetchBuiCount, 2000);
    setInterval(fetchTopBui, 2000);
});



