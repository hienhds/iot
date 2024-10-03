document.addEventListener("DOMContentLoaded", function() {
    // Khởi tạo kết nối WebSocket
    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);

// Biến lưu trữ dữ liệu cảm biến
    let temperature;
    let humidity;
    let light;
    let dust;
    let okkkk = "off";

// NHận data từ sensor gửi về
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        // Đăng ký nhận dữ liệu cảm biến
        stompClient.subscribe('/topic/sensorData', function (data) {
            const sensorData = JSON.parse(data.body);

            // Cập nhật dữ liệu nhiệt độ, độ ẩm, ánh sáng
            temperature = sensorData.temperature;
            document.getElementById("temperature-value").innerHTML = `${temperature}\u00B0C`;
            updateProgressBar("temperature", temperature);

            humidity = sensorData.humidity;
            document.getElementById('humidity-value').innerHTML = `${humidity}%`;
            updateProgressBar("humidity", humidity);

            light = sensorData.light;
            document.getElementById("light-value").innerHTML = `${light} lux`;
            updateProgressBar("light", light);

            dust = sensorData.bui;
            document.getElementById("dust-value").innerHTML = `${dust} µg/m³`;
            updateProgressBar("dust", dust);

            checkBuiLevel(sensorData.bui);

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
                document.getElementById("fan").src = "image/fan_on.gif"; // Hình ảnh đèn sáng
                document.getElementById("fan-control").src = "image/on.png"; // Hình ảnh nút điều khiển sáng
                document.getElementById("fan-control").setAttribute("data-state", "on"); // Cập nhật trạng thái

            } else if (state === "off") {
                document.getElementById("fan").src = "image/fan_off.png"; // Hình ảnh đèn tắt
                document.getElementById("fan-control").src = "image/off.png"; // Hình ảnh nút điều khiển tắt
                document.getElementById("fan-control").setAttribute("data-state", "off"); // Cập nhật trạng thái

            }
        });

        stompClient.subscribe('/topic/allStatus', function (message) {
            const state = message.body;

            // Cập nhật trạng thái và hình ảnh dựa trên phản hồi từ server
            if (state === "on") {
                document.getElementById("fan").src = "image/fan_on.gif"; // Hình ảnh đèn sáng
                document.getElementById("fan-control").src = "image/on.png"; // Hình ảnh nút điều khiển sáng
                document.getElementById("fan-control").setAttribute("data-state", "on"); // Cập nhật trạng thái

                document.getElementById("air-con").src = "image/air_con_on.png"; // Hình ảnh ddieeuf hoaf sáng
                document.getElementById("air-con-control").src = "image/on.png"; // Hình ảnh nút điều khiển sáng
                document.getElementById("air-con-control").setAttribute("data-state", "on"); //

                document.getElementById("lamp").src = "image/lamp_on.png"; // Hình ảnh đèn sáng
                document.getElementById("lamp-control").src = "image/on.png"; // Hình ảnh nút điều khiển sáng
                document.getElementById("lamp-control").setAttribute("data-state", "on"); // Cập

                document.getElementById("all-control").src = "image/on.png";
                document.getElementById("all-control").setAttribute("data-state", "on");

            } else if (state === "off") {
                document.getElementById("fan").src = "image/fan_off.png"; // Hình ảnh đèn tắt
                document.getElementById("fan-control").src = "image/off.png"; // Hình ảnh nút điều khiển tắt
                document.getElementById("fan-control").setAttribute("data-state", "off"); // Cập nhật trạng thái

                document.getElementById("air-con").src = "image/air_con_off.png"; // Hình ảnh đèn tắt
                document.getElementById("air-con-control").src = "image/off.png"; // Hình ảnh nút điều khiển tắt
                document.getElementById("air-con-control").setAttribute("data-state", "off"); // Cập nhật trạng thái

                document.getElementById("lamp").src = "image/lamp_off.png"; // Hình ảnh đèn tắt
                document.getElementById("lamp-control").src = "image/off.png"; // Hình ảnh nút điều khiển tắt
                document.getElementById("lamp-control").setAttribute("data-state", "off"); // Cập nhật trạn

                document.getElementById("all-control").src = "image/off.png";
                document.getElementById("all-control").setAttribute("data-state", "off");



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
            }
        });

        document.getElementById("all-control").addEventListener("click", function () {
            // Hiển thị ảnh loading để chờ phản hồi
            this.src = "image/loading.gif";
            const currentState = this.getAttribute("data-state");
            console.log("3 thiets bị")
            // Kiểm tra trạng thái hiện tại và gửi tín hiệu điều khiển đèn qua WebSocket
            if (currentState === "on") {
                stompClient.send(`/app/allControl`, {}, "off");
            } else if (currentState === "off") {
                stompClient.send(`/app/allControl`, {}, "on");
            }
        });

    }, function (error) {
        console.error('STOMP connection error: ' + error);
    });

    // hàm thay đổi các giá trị màu sắc, theo giá trị
    function updateProgressBar(type, value) {
        const elementProgress = document.getElementById(`${type}-progress`);
        const elementValue = document.getElementById(`${type}-value`);
        const iconImg = document.getElementById(`${type}-icon-img`);
        const iconProgress = document.getElementById(`${type}-icon-progress`);

        // Mảng các màu sắc tùy theo loại dữ liệu
        const colors = {
            temperature: ['#ba3348', '#b42c2c', '#d02b10', '#ff0000', '#DC143C', '#B22222', '#FF0000'],
            light: ['#e3e01d', '#eaea00', '#cc7415', '#ff8000', '#ffc107', '#ffb300', '#ff8c00'],
            humidity: ['#b0e0e6', '#add8e6', '#87ceeb', '#4682b4', '#1e90ff', '#4169e1', '#0000ff'],
            dust: ['#a964b9', '#9426ab', '#a707b7', '#ee00ff']
        };

        // Mảng các biểu tượng tương ứng với các khoảng giá trị
        const icons = {
            temperature: [
                '../image/icon_lanh.png',
                '../image/icon_lanh.png',
                '../image/icon_warm.png',
                '../image/icon_warm.png',
                '../image/icon_hot.png',
                '../image/icon_hot.png',
                '../image/icon_so_hot.png'
            ],
            light: [
                '../image/icon-moon.png',
                '../image/sun-icon.png',
                '../image/sun-icon.png',
                '../image/sun-icon.png',
                '../image/sun-icon.png'
            ],
            humidity: [
                '../image/icon-am.png',
                '../image/icon-am.png',
                '../image/icon-am.png',
                '../image/icon-am.png',
                '../image/icon-am.png'
            ],
            dust: [
                'image/bui2.png',
                'image/bui2.png',
                'image/bui1.png',
                'image/bui1.png'
            ]
        };

        // Cấu hình các giá trị tối thiểu và tối đa tùy theo loại dữ liệu
        const minMaxValues = {
            temperature: { min: 0, max: 50 },
            light: { min: 0, max: 5000 },
            humidity: { min: 0, max: 100 },
            dust: { min: 0, max: 100 }
        };

        // Lấy giá trị tối thiểu và tối đa cho loại dữ liệu
        const minValue = minMaxValues[type].min;
        const maxValue = minMaxValues[type].max;

        // Tính toán chỉ số cho mảng màu và biểu tượng dựa trên giá trị
        const colorIndex = Math.min(Math.floor((value - minValue) / (maxValue / colors[type].length)), colors[type].length - 1);

        // Áp dụng màu và biểu tượng cho giá trị
        elementValue.style.color = colors[type][colorIndex];
        iconImg.src = icons[type][colorIndex];
        console.log(type, colorIndex);

        // Tính toán phần trăm của giá trị
        const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
        elementProgress.style.width = `${percentage}%`;
        elementProgress.style.backgroundColor = colors[type][colorIndex];

        // Cập nhật vị trí icon trong thanh tiến trình dựa trên phần trăm
        const container = elementProgress.parentElement;
        const containerWidth = container.offsetWidth;
        const barWidthInPx = (percentage / 100) * containerWidth;
        iconProgress.style.left = `${barWidthInPx}px`;
        iconProgress.style.color = colors[type][colorIndex];
    }

    // hàm xây dựng cảnh báo
    function checkBuiLevel(bui) {
        if (bui > 80 && okkkk === "off") {
            okkkk = "on";
            stompClient.send(`/app/fanControl`, {}, "on");
            startBlinking();
        }
        else if (bui < 80){
            okkkk = "off";
            stompClient.send(`/app/fanControl`, {}, "off");
            stopBlinking();
        }
    }
    function startBlinking() {
        document.getElementById('box-bui').classList.add('blink-box');
    }

    function stopBlinking() {
        document.getElementById('box-bui').classList.remove('blink-box');
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
                        temperature: [],
                        bui: []
                    };
                }

                // Thêm các giá trị vào mảng tương ứng trong mốc giờ
                groupedData[hourRange].light.push(d.light);
                groupedData[hourRange].humidity.push(d.humidity);
                groupedData[hourRange].temperature.push(d.temperature);
                groupedData[hourRange].bui.push(d.bui);
            });

            // Hàm tính trung bình
            const calculateAverage = (arr) => {
                if (arr.length === 0) return 0;
                const sum = arr.reduce((acc, val) => acc + val, 0);
                return (sum / arr.length).toFixed(2);;
            };

            // Chuẩn bị dữ liệu để vẽ biểu đồ
            const lightData = [];
            const humidityData = [];
            const temperatureData = [];
            const buiData = [];
            const timeCategories = [];

            // Lấy 10 giá trị gần nhất nếu thiếu
            const ensureMinValues = (arr, key) => {
                if (arr.length < 10) {
                    const missingValues = data
                        .filter(d => {
                            const date = new Date(d.timestamp);
                            const hour = date.getUTCHours();
                            return `${hour}:00-${hour + 1}:00` !== key;
                        })
                        .slice(0, 10 - arr.length); // Lấy 10 - arr.length giá trị gần nhất
                    return arr.concat(missingValues.map(d => d[key]));
                }
                return arr;
            };

            for (const hourRange in groupedData) {
                const group = groupedData[hourRange];

                // Nếu có ít hơn 10 giá trị, lấy 10 giá trị gần nhất
                group.light = ensureMinValues(group.light, 'light');
                group.humidity = ensureMinValues(group.humidity, 'humidity');
                group.temperature = ensureMinValues(group.temperature, 'temperature');
                group.bui = ensureMinValues(group.bui, 'bui');

                // Tính giá trị trung bình cho mỗi khoảng giờ
                lightData.push(calculateAverage(group.light));
                humidityData.push(calculateAverage(group.humidity));
                temperatureData.push(calculateAverage(group.temperature));
                buiData.push(calculateAverage(group.bui));
                timeCategories.push(hourRange); // Thêm mốc giờ vào danh sách thời gian
            }

            // Khởi tạo biểu đồ ApexCharts với dữ liệu trung bình
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
                }, {
                    name: 'Độ Bụi',
                    data: buiData
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
                colors: ['#4154f1', '#2eca6a', '#ff771d', '#ff1d1d'],
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
                        light: []
                    };
                }

                // Thêm các giá trị vào mảng tương ứng trong mốc giờ
                groupedData[hourRange].light.push(d.light);
            });

            // Hàm tính trung bình
            const calculateAverage = (arr) => {
                if (arr.length === 0) return 0;
                const sum = arr.reduce((acc, val) => acc + val, 0);
                return (sum / arr.length).toFixed(2);
            };

            // Chuẩn bị dữ liệu để vẽ biểu đồ
            const lightData = [];
            const timeCategories = [];

            // Lấy 10 giá trị gần nhất nếu thiếu
            const ensureMinValues = (arr, key) => {
                if (arr.length < 10) {
                    const missingValues = data
                        .filter(d => {
                            const date = new Date(d.timestamp);
                            const hour = date.getUTCHours();
                            return `${hour}:00-${hour + 1}:00` !== key;
                        })
                        .slice(0, 10 - arr.length); // Lấy 10 - arr.length giá trị gần nhất
                    return arr.concat(missingValues.map(d => d[key]));
                }
                return arr;
            };

            for (const hourRange in groupedData) {
                const group = groupedData[hourRange];

                // Nếu có ít hơn 10 giá trị, lấy 10 giá trị gần nhất
                group.light = ensureMinValues(group.light, 'light');

                // Tính giá trị trung bình cho mỗi khoảng giờ
                lightData.push(calculateAverage(group.light));
                timeCategories.push(hourRange); // Thêm mốc giờ vào danh sách thời gian
            }

            // Khởi tạo biểu đồ ApexCharts với dữ liệu trung bình
            new ApexCharts(document.querySelector("#reportsChart2"), {
                series: [{
                    name: 'Ánh Sáng',
                    data: lightData,
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
                colors: ['#4154f1'],
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


  