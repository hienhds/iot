document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.control-img');

    images.forEach(img => {
        img.addEventListener('click', function() {
            const currentState = img.getAttribute('data-state');
            const newState = currentState === 'off' ? 'on' : 'off';
            img.setAttribute('data-state', newState);
            
            // Cập nhật nguồn hình ảnh nếu cần
            img.src = newState === 'on' ? 'image/on.png' : 'image/off.png';
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    new ApexCharts(document.querySelector("#reportsChart"), {
        series: [{
            name: 'Ánh Sáng',
            data: [31, 40, 28, 51, 42, 82, 56],
        }, {
            name: 'Độ Ẩm',
            data: [11, 32, 45, 32, 34, 52, 41]
        }, {
            name: 'Nhiệt Độ',
            data: [15, 11, 32, 18, 9, 24, 11]
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
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }).render();
});


document.addEventListener("DOMContentLoaded", function() {
    const temperature = 40; // Thay đổi giá trị nhiệt độ tại đây
    document.getElementById("temperature").innerHTML = `${temperature}&#176;C`;
    const temperatureElement = document.getElementById('temperature');
    const iconElement = document.getElementById('temp-icon-img');

    if (temperature <= 10) {
        temperatureElement.classList.add('temp-cold');
        iconElement.src = '../image/icon_cool.jpg'; // Hình ảnh cho nhiệt độ lạnh
    } else if (temperature <= 25) {
        temperatureElement.classList.add('temp-cool');
        iconElement.src = '../image/icon_warm.png'; // Hình ảnh cho nhiệt độ mát
    } else if (temperature <= 35) {
        temperatureElement.classList.add('temp-warm');
        iconElement.src = '../image/icon_hot.jpg'; // Hình ảnh cho nhiệt độ ấm
    } else {
        temperatureElement.classList.add('temp-hot');
        iconElement.src = '../image/icon_so_hot.jpg'; // Hình ảnh cho nhiệt độ nóng
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const light = 60; // Thay đổi giá trị nhiệt độ tại đây
    document.getElementById("light").innerHTML = `${light}`;
    const lightElement = document.getElementById('light');
    const iconElement = document.getElementById('li-icon-img');

    if (light <= 50) {
        lightElement.classList.add('li-toi');
        iconElement.src = '../image/icon_toi.jpg'; // Hình ảnh cho nhiệt độ lạnh
    } 
    else {
        lightElement.classList.add('li-sang');
        iconElement.src = '../image/icon_sang.jpg'; // Hình ảnh cho nhiệt độ nóng
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const moisture = 60; // Thay đổi giá trị nhiệt độ tại đây
    document.getElementById("moisture").innerHTML = `${moisture}`;
    const moistureElement = document.getElementById('moisture');
    const iconElement = document.getElementById('mois-icon-img');

    if (moisture <= 50) {
        moistureElement.clasmoisst.add('mois-kho');
        iconElement.src = '../image/icon_kho.png'; // Hình ảnh cho nhiệt độ lạnh
    } 
    else {
        moistureElement.classList.add('mois-am');
        iconElement.src = '../image/icon_am.jpg'; // Hình ảnh cho nhiệt độ nóng
    }
});
