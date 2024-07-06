document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el contenedor de ECharts
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    // Configuración del gráfico de línea
    option = {
        title: {
            text: 'Ejemplo de Gráfico de Línea'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Ventas']
        },
        xAxis: {
            type: 'category',
            data: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Ventas',
                type: 'line',
                data: [150, 230, 224, 218, 135, 147, 260]
            }
        ]
    };

    // Establecer la opción de configuración del gráfico
    option && myChart.setOption(option);
});