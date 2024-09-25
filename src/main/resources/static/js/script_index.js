document.addEventListener("DOMContentLoaded", function() {
    // Khởi tạo kết nối WebSocket
    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);

// Biến lưu trữ dữ liệu cảm biến
    let temperature;
    let humidity;
    let light;
    let okkkk = "off";

// Kết nối STOMP
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        // Đăng ký nhận dữ liệu cảm biến
        stompClient.subscribe('/topic/sensorData', function (data) {
            const sensorData = JSON.parse(data.body);

            // Cập nhật dữ liệu nhiệt độ, độ ẩm, ánh sáng
            temperature = sensorData.temperature;
            document.getElementById("temperature").innerHTML = `${temperature}\u00B0C`;
            updateProgressBar();

            humidity = sensorData.humidity;
            document.getElementById('humidity').innerHTML = `${humidity}%`;
            updateProgressBarhumidity();

            light = sensorData.light;
            document.getElementById("light").innerHTML = `${light} lux`;
            updateProgressBarLight();


            function checkLightLevel(light) {
                console.log(okkkk)
                if (light < 500 && okkkk === "off") {
                    okkkk = "on"; // Cập nhật trạng thái
                    alert("ánh sáng, bật đèn");
                    stompClient.send(`/app/lampControl`, {}, "on");
                } else if (light >= 3000 && okkkk === "on") {
                    okkkk = "off"; // Cập nhật trạng thái khi ánh sáng đủ
                    alert("ánh sáng mạnh, tắt đèn");
                    stompClient.send(`/app/lampControl`, {}, "off");
                }
            }
            // checkLightLevel(sensorData.light);



        }, function (error) {
            console.error('STOMP error: ' + error);
        });

        // Đăng ký nhận phản hồi từ đèn khi có thay đổi trạng thái
        stompClient.subscribe('/topic/lampStatus', function (message) {
            const state = message.body;
            okkkk = state
            if (state === "on") {
                document.getElementById("lamp").src = "image/lamp_on.png"; // Hình ảnh đèn sáng
                document.getElementById("lamp-control").src = "image/on.png"; // Hình ảnh nút điều khiển sáng
                document.getElementById("lamp-control").setAttribute("data-state", "on"); // Cập nhật trạng thái
                console.log("Đèn đã bật.");
            } else if (state === "off") {
                document.getElementById("lamp").src = "image/lamp_off.png"; // Hình ảnh đèn tắt
                document.getElementById("lamp-control").src = "image/off.png"; // Hình ảnh nút điều khiển tắt
                document.getElementById("lamp-control").setAttribute("data-state", "off"); // Cập nhật trạng thái
                console.log("Đèn đã tắt.");
            }
        });

        stompClient.subscribe('/topic/airConStatus', function (message) {
            const state = message.body;
            console.log("Nhận được trạng thái điều hòa: ", state);
            // Cập nhật trạng thái và hình ảnh dựa trên phản hồi từ server
            if (state === "on") {
                document.getElementById("air-con").src = "image/air_con_on.png"; // Hình ảnh ddieeuf hoaf sáng
                document.getElementById("air-con-control").src = "image/on.png"; // Hình ảnh nút điều khiển sáng
                document.getElementById("air-con-control").setAttribute("data-state", "on"); // Cập nhật trạng thái

            } else if (state === "off") {
                document.getElementById("air-con").src = "image/air_con_off.png"; // Hình ảnh đèn tắt
                document.getElementById("air-con-control").src = "image/off.png"; // Hình ảnh nút điều khiển tắt
                document.getElementById("air-con-control").setAttribute("data-state", "off"); // Cập nhật trạng thái

            }
        });

        stompClient.subscribe('/topic/fanStatus', function (message) {
            const state = message.body;

            // Cập nhật trạng thái và hình ảnh dựa trên phản hồi từ server
            if (state === "on") {
                document.getElementById("fan").src = "image/fan_on.png"; // Hình ảnh đèn sáng
                document.getElementById("fan-control").src = "image/on.png"; // Hình ảnh nút điều khiển sáng
                document.getElementById("fan-control").setAttribute("data-state", "on"); // Cập nhật trạng thái

            } else if (state === "off") {
                document.getElementById("fan").src = "image/fan_off.png"; // Hình ảnh đèn tắt
                document.getElementById("fan-control").src = "image/off.png"; // Hình ảnh nút điều khiển tắt
                document.getElementById("fan-control").setAttribute("data-state", "off"); // Cập nhật trạng thái

            }
        });

        // Xử lý sự kiện khi nhấn vào nút điều khiển đèn
        document.getElementById("lamp-control").addEventListener("click", function () {
            // Hiển thị ảnh loading để chờ phản hồi
            this.src = "image/loading.gif";
            const currentState = this.getAttribute("data-state");

            // Kiểm tra trạng thái hiện tại và gửi tín hiệu điều khiển đèn qua WebSocket
            if (currentState === "on") {
                stompClient.send(`/app/lampControl`, {}, "off");
                console.log("Đang tắt đèn...");
            } else if (currentState === "off") {
                stompClient.send(`/app/lampControl`, {}, "on");
                console.log("Đang bật đèn...");
            }
        });

        document.getElementById("air-con-control").addEventListener("click", function () {
            // Hiển thị ảnh loading để chờ phản hồi
            this.src = "image/loading.gif";
            const currentState = this.getAttribute("data-state");

            // Kiểm tra trạng thái hiện tại và gửi tín hiệu điều khiển đèn qua WebSocket
            if (currentState === "on") {
                stompClient.send(`/app/air-conControl`, {}, "off");
                // console.log("Đang tắt đèn...");
            } else if (currentState === "off") {
                stompClient.send(`/app/air-conControl`, {}, "on");
                console.log("Đang bật đèn...");
            }
        });

        document.getElementById("fan-control").addEventListener("click", function () {
            // Hiển thị ảnh loading để chờ phản hồi
            this.src = "image/loading.gif";
            const currentState = this.getAttribute("data-state");

            // Kiểm tra trạng thái hiện tại và gửi tín hiệu điều khiển đèn qua WebSocket
            if (currentState === "on") {
                stompClient.send(`/app/fanControl`, {}, "off");
                // console.log("Đang tắt đèn...");
            } else if (currentState === "off") {
                stompClient.send(`/app/fanControl`, {}, "on");
                console.log("Đang bật đèn...");
            }
        });

    }, function (error) {
        console.error('STOMP connection error: ' + error);
    });

    function updateProgressBar() {
        const temperatureElementBar = document.getElementById('temperature-progress');
        const temperatureElement = document.getElementById('temperature');
        const iconElement = document.getElementById('temp-icon-img');
        const iconTest = document.getElementById("icon-progress");

        // Mảng các màu sắc từ lạnh đến nóng
        const colors = ['#00BFFF', '#87CEEB', '#ADD8E6', '#FFD700', '#FFA500', '#FF4500', '#FF0000'];

        // Mảng các biểu tượng tương ứng với các khoảng nhiệt độ
        const icons = [
            '../image/icon_cool.jpg',
            '../image/icon_cool.jpg',
            '../image/icon_warm.png',
            '../image/icon_warm.png',
            '../image/icon_hot.jpg',
            '../image/icon_hot.jpg',
            '../image/icon_so_hot.jpg'
        ];

        // Tính toán chỉ số cho mảng màu và biểu tượng dựa trên nhiệt độ (0 đến 40 độ)
        const minTemp = 0;
        const maxTemp = 50;
        const colorIndex = Math.min(Math.floor((temperature - minTemp) / (maxTemp / colors.length)), colors.length - 1);

        // Áp dụng màu cho nhiệt độ và biểu tượng
        temperatureElement.style.color = colors[colorIndex];
        iconElement.src = icons[colorIndex];

        // Tính toán phần trăm của nhiệt độ
        const percentage = ((temperature - minTemp) / (maxTemp - minTemp)) * 100;
        temperatureElementBar.style.width = `${percentage}%`;
        temperatureElementBar.style.backgroundColor = colors[colorIndex];

        // Cập nhật vị trí icon trong thanh tiến trình dựa trên phần trăm
        const container = temperatureElementBar.parentElement;
        const containerWidth = container.offsetWidth;
        const barWidthInPx = (percentage / 100) * containerWidth;
        iconTest.style.left = `${barWidthInPx}px`;
        iconTest.style.color = colors[colorIndex];
    }

    function updateProgressBarLight() {
        const lightElementBar = document.getElementById('light-progress');
        const lightElement = document.getElementById('light');
        const iconElement = document.getElementById('li-icon-img');
        const iconLight = document.getElementById("light-icon-progress");

        const colors = ['#1c1c1c', '#2c3e50', '#7f8c8d', '#bdc3c7', '#ecf0f1'];

        // Mảng các biểu tượng tương ứng với các khoảng nhiệt độ
        const icons = [
            '../image/icon_toi.jpg',
            '../image/icon_sang.jpg',
            '../image/icon_sang.jpg',
            '../image/icon_sang.jpg',
            '../image/icon_sang.jpg'
        ];

        // Tính toán chỉ số cho mảng màu và biểu tượng dựa trên nhiệt độ (0 đến 40 độ)
        const minli = 0;
        const maxli = 7000;
        const colorIndex = Math.min(Math.floor((light - minli) / (maxli / colors.length)), colors.length - 1);

        // Áp dụng màu cho nhiệt độ và biểu tượng
        lightElement.style.color = colors[colorIndex];
        iconElement.src = icons[colorIndex];

        // Tính toán phần trăm của nhiệt độ
        const percentage = ((light - minli) / (maxli - minli)) * 100;
        lightElementBar.style.width = `${percentage}%`;
        lightElementBar.style.backgroundColor = colors[colorIndex];

        // Cập nhật vị trí icon trong thanh tiến trình dựa trên phần trăm
        const container = lightElementBar.parentElement;
        const containerWidth = container.offsetWidth;
        const barWidthInPx = (percentage / 100) * containerWidth;
        iconLight.style.left = `${barWidthInPx}px`;
        iconLight.style.color = colors[colorIndex];
    }
    function updateProgressBarhumidity() {
        const humidityElementBar = document.getElementById('humidity-progress');
        const humidityElement = document.getElementById('humidity');
        const iconElement = document.getElementById('hum-icon-img');
        const iconhumidity = document.getElementById("humidity-icon-progress");

        const colors = ['#C1C1C1', '#A3C2C2', '#7D9A9A', '#4D8C8C', '#006D6D'];

        // Mảng các biểu tượng tương ứng với các khoảng nhiệt độ
        const icons = [
            '../image/icon_am.jpg',
            '../image/icon_am.jpg',
            '../image/icon_kho.png',
            '../image/icon_kho.png',
            '../image/icon_kho.png'
        ];

        const minhum = 0;
        const maxhum = 100;

        const colorIndex = Math.min(Math.floor((humidity - minhum) / (maxhum / colors.length)), colors.length - 1);

        // Áp dụng màu cho nhiệt độ và biểu tượng
        humidityElement.style.color = colors[colorIndex];
        iconElement.src = icons[colorIndex];

        const percentage = ((humidity - minhum) / (maxhum - minhum)) * 100;
        humidityElementBar.style.width = `${percentage}%`;
        humidityElementBar.style.backgroundColor = colors[colorIndex];

        const container = humidityElementBar.parentElement;
        const containerWidth = container.offsetWidth;
        const barWidthInPx = (percentage / 100) * containerWidth;
        iconhumidity.style.left = `${barWidthInPx}px`;
        iconhumidity.style.color = colors[colorIndex];
    }
});

// hiển thị biểu đồ
document.addEventListener("DOMContentLoaded", () => {
    // Gọi API để lấy dữ liệu từ server
    fetch('/api/chart')
        .then(response => response.json())
        .then(data => {
            // Khởi tạo biến để nhóm dữ liệu
            const groupedData = {};

            // Nhóm dữ liệu theo giờ
            data.forEach(d => {
                const date = new Date(d.timestamp);
                const hour = date.getUTCHours(); // Lấy giờ (theo UTC)
                const hourRange = `${hour}:00-${hour + 1}:00`; // Tạo mốc thời gian theo giờ

                // Nếu mốc giờ chưa có trong nhóm thì tạo mảng mới
                if (!groupedData[hourRange]) {
                    groupedData[hourRange] = {
                        light: [],
                        humidity: [],
                        temperature: []
                    };
                }

                // Thêm các giá trị vào mảng tương ứng trong mốc giờ
                groupedData[hourRange].light.push(d.light);
                groupedData[hourRange].humidity.push(d.humidity);
                groupedData[hourRange].temperature.push(d.temperature);
            });

            // Tính trung bình cho từng khoảng thời gian
            const lightData = [];
            const humidityData = [];
            const temperatureData = [];
            const timeCategories = [];

            for (const hourRange in groupedData) {
                const lightAvg = (groupedData[hourRange].light.reduce((sum, value) => sum + value, 0) / groupedData[hourRange].light.length).toFixed(2);
                const humidityAvg = (groupedData[hourRange].humidity.reduce((sum, value) => sum + value, 0) / groupedData[hourRange].humidity.length).toFixed(2);
                const temperatureAvg = (groupedData[hourRange].temperature.reduce((sum, value) => sum + value, 0) / groupedData[hourRange].temperature.length).toFixed(2);

                // Đẩy giá trị trung bình vào mảng dữ liệu
                lightData.push(parseFloat(lightAvg));  // Chuyển lại về số thực
                humidityData.push(parseFloat(humidityAvg));
                temperatureData.push(parseFloat(temperatureAvg));
                timeCategories.push(hourRange); // Thêm mốc giờ vào danh sách thời gian
            }


            // Khởi tạo biểu đồ ApexCharts với dữ liệu trung bình theo giờ
            new ApexCharts(document.querySelector("#reportsChart"), {
                series: [{
                    name: 'Ánh Sáng',
                    data: lightData,
                }, {
                    name: 'Độ Ẩm',
                    data: humidityData
                }, {
                    name: 'Nhiệt Độ',
                    data: temperatureData
                }],
                chart: {
                    height: 350,
                    type: 'area',
                    toolbar: {
                        show: false
                    },
                },
                markers: {
                    size: 4
                },
                colors: ['#4154f1', '#2eca6a', '#ff771d'],
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.3,
                        opacityTo: 0.4,
                        stops: [0, 90, 100]
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                xaxis: {
                    categories: timeCategories // Mốc giờ (00:00-01:00, 01:00-02:00, ...)
                },
                tooltip: {
                    x: {
                        format: 'HH:mm' // Định dạng hiển thị thời gian trong tooltip
                    },
                }
            }).render();
        })
        .catch(error => console.error('Error fetching data:', error));
});




// Hiển thị nút khi cuộn trang xuống dưới 100px
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


  