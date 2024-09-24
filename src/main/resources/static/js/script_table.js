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


function searchDeviceHistory() {
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



