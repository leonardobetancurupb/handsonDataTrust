document.addEventListener('DOMContentLoaded', async function() {
    // init ECharts
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;
    const response_types = await fetch("/administrator/echarts_types/");
    const jsonData = await response_types.json();
    jsonData.sort((a, b) => b.value - a.value);
    const values = jsonData.map(item => item.value);
    const names = jsonData.map(item => item.name);
    // Configuration Echarts
    option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: names,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: values
          }
        ]
      };

    // Echart template
    option && myChart.setOption(option);

    const fetchLogs = async () => {
        try {
            const response = await fetch("/administrator/logs/");
            const jsonData = await response.json();
            const logsTableBody = document.querySelector("#logsTable tbody");

            // Convert the JSON object to an array and sort it by log_id in descending order
            const logsArray = Object.values(jsonData);
            logsArray.sort((a, b) => b.log_id - a.log_id);

            // Get only the last 7 logs
            const lastSevenLogs = logsArray.slice(0, 7);

            const createRow = (log) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${log.log_id}</td>
                    <td>${log.type}</td>
                    <td>${log.source}</td>
                    <td>${log.destination}</td>
                    <td>${log.description.content.description}</td>
                    <td>${new Date(log.timestamp * 1000).toLocaleString()}</td>
                `;

                return row;
            };

            const updateTable = () => {
                logsTableBody.innerHTML = ''; // Clear the table body
                lastSevenLogs.forEach(log => logsTableBody.appendChild(createRow(log)));
            };

            // Initial table population
            updateTable();
        } catch (error) {
            // Optionally display an error message to the user
            const alertContainer = document.getElementById('alertContainer');
            const alertHtml = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> Failed to load data.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
            `;
            alertContainer.innerHTML = alertHtml;
        }
    };

    fetchLogs();
});

document.addEventListener("DOMContentLoaded", function() {
    
});
