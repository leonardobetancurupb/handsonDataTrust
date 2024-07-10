document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el contenedor de ECharts
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    // Configuración del gráfico de línea
    option = {
        title: {
            text: 'Count'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Ventas']
        },
        xAxis: {
            type: 'category',
            data: ['Mond', 'Thue', 'Wedn', 'Thur', 'Frid', 'Satu', 'Sund']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Count',
                type: 'line',
                data: [150, 230, 224, 218, 135, 147, 260]
            }
        ]
    };

    // Establecer la opción de configuración del gráfico
    option && myChart.setOption(option);
});