import React from 'react';
import Chart from 'chart.js';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Box, Button} from '@material-ui/core';

class ChartComponent extends React.Component {
    /**
     * @param props - Передаваемые props должны содержать данные для построения графика в свойстве data.
     */
    constructor(props) {
        super(props);

        this.chartRef = React.createRef();
        this.colors = {};
    }

    /**
     * Вызывается как только происходит добавление компонента в DOM
     */
    componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
            type: 'line',
            options: {
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 10,
                        bottom: 10
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: false
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            reverse: true,
                        }
                    }],
                }
            }
        });
    }

    /**
     * Обновление при изменении состояния
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {

        /**
         * Функция возвращает цвет по key, если его нет, то создаёт новый цвет.
         * @param key - Уникальное значения для получения цвета.
         * @returns {string|*} - Возвращаемое значение цвета
         */
        const  getColor = (key) => {
            const colorForKey = _.get(this.colors, key);

            if (colorForKey) {
                return colorForKey;
            }
            const letters = '0123456789ABCDEF'.split('');
            let color = '#';

            for (let i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }

            this.colors[key] = color;

            return color;
        };

        /**
         * Функция возвращает минимальное значение для массива данных.
         * @param datas - Передаваемый массив со следующей структурой:
         *      [{data: [{value: 1}, {value: 2}]}, {data: [{value: -1}]}]
         *      В данной структуре сравнение происходит по свойству value.
         * @returns {number} - Возвращаемое минимальное значение.
         */
        function getMinData(datas) {
            let minValue = Infinity;

            if (_.isArray(datas)) {
                datas.forEach(dataObject => {
                    const dataValues = _.get(dataObject, 'data');

                    if (dataValues && _.isArray(dataValues)) {
                        const currentMinObject = _.minBy(dataValues, 'value');
                        const currentMinValue = _.get(currentMinObject, 'value');

                        if (currentMinValue < minValue) {
                            minValue = currentMinValue;
                        }
                    }
                })
            }

            return minValue;
        }

        this.myChart.data = {
            labels: (_.get(this.props, 'data[0].data') || []).map(d => d.label),
            datasets: (_.get(this.props, 'data') || []).map(item => {
                return {
                    label: item.title,
                    data: item.data.map(d => d.value),
                    fill: 'none',
                    lineTension: 0,
                    pointRadius: 0,
                    borderColor: getColor(item.title),
                    backgroundColor: getColor(item.title)
                };
            })
        };

        this.myChart.options = {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            legend: {
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                }],
                yAxes: [{
                    ticks: {
                        reverse: true,
                        min: getMinData(_.get(this.props, 'data'))
                    }
                }]
            }
        };

        this.myChart.update();
    }

    /**
     * Метод позволяет скачать файл.
     * @param blob - Blob объект, данных, которые нужно сохранить в файл.
     * @param fileName - Название файла, с расширением, например: chart.png.
     */
    saveData(blob, fileName) {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        a.style = "display: none";
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    /**
     * Метод позволяет скачать изображение графика, созданного с помощью ChartJs.
     */
    downloadPng() {
        this.chartRef.current.toBlob((blob) => {
            this.saveData(blob, 'chart.png')
        });
    }

    /**
     * Метод позволяет скачать данные графика, созданного с помощью ChartJs.
     * Выходной формат данных - csv.
     */
    downloadCSV() {
        const saveDataArray = [];
        const dataArray = _.get(this.props, 'data') || [];

        dataArray.forEach((dataGame) => {
            saveDataArray[0] = `${(saveDataArray[0] ? saveDataArray[0] : '"Date"')},"${(dataGame.title || "")}"`;
            dataGame.data.forEach((dataValue, j) => {
                saveDataArray[j + 1] = `${(saveDataArray[j + 1]
                    ? saveDataArray[j + 1]
                    : ('"' + dataValue.label + '"'))},"${(dataValue.value || "")}"`;
            });
        });

        const fetchedCountries = _.get(this.props, 'country.fetchedCountries');
        const selectCountryObject = _.find(fetchedCountries, {id: _.get(this.props, 'country.selectCountryId')});
        const selectCountryName = _.get(selectCountryObject, 'country');
        const saveDataString = `"App: MineCraft"\n"Country: ${selectCountryName}"\n` + saveDataArray.join('\n');

        const blob = new Blob([saveDataString], {
            type: 'text/plain'
        });

        this.saveData(blob, 'chart-data.csv');
    }

    render() {
        return (
            <Box>
                <canvas ref={this.chartRef}/>
                <Box pt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{
                            marginRight: '1rem'
                        }}
                        onClick={() => {
                            this.downloadPng();
                        }}
                    >
                        Download PNG
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => {
                        this.downloadCSV();
                    }}>
                        Download CSV
                    </Button>
                </Box>
            </Box>
        );
    }
}

const mapStateToProps = state => {

    return state;
};

export default connect(mapStateToProps, null)(ChartComponent);
