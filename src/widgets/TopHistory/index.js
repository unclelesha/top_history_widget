import React from 'react';
import ChartComponent from '../../components/ChartComponent/index.js';
import HeaderBar from '../../components/HeaderBar/index.js';
import {fetchCountries, fetchCategories, fetchAppsData, selectCountryId} from '../../redux/actions';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import {Box} from '@material-ui/core';

class TopHistory extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const fetchCountriesPromise = this.props.fetchCountries().then(() => {
            const countryId = _.get(this.props, 'country.fetchedCountries[0].id');

            if (countryId) {
                this.props.selectCountryId(countryId);
            }
        });
        const fetchCategoriesPromise = this.props.fetchCategories();

        // Выполнение загрузки основных данных после загрузки категорий и стран.
        Promise.all([fetchCountriesPromise, fetchCategoriesPromise]).then(() => {
            this.props.fetchAppsData({
                selectCountryId: this.props.country.selectCountryId,
                dateRange: {
                    startDate: moment().subtract(30, 'days').format('yyyy-MM-DD'),
                    endDate: moment().format('yyyy-MM-DD'),
                }
            });
        })
    }

    render() {
        return (
            <Box p={2} borderRadius={8} bgcolor="white" className="App">
                <HeaderBar />
                <ChartComponent
                    data={this.props.fetchedAppsData}
                    title={this.props.fetchedAppsData.map(appData => appData.title)}
                />
            </Box>
        );
    }
}

/**
 * Функция форматирует данные в вид, необходимый графику.
 * @param state - Данные состояния из стора.
 * @returns {[]|Array} - Отформатированный массив данных
 */
function appsDataFormatted(state) {
    const fetchedAppsData = _.get(state, 'appsData.fetchedAppsData');
    const {fetchedCategories, subCategoriesMap} = _.get(state, 'categories');

    if (fetchedAppsData) {
        const chartData = [];

        /**
         * Форматирование данных. Где данные вида {'2020-09-19': 1} будут превращены в [{label: 19 Sep 20}, value: 1].
         * @param subCategoryObject - Объект данных.
         * @returns {Object} - Возвращаемый массив полученных объектов.
         */
        function getDataValues(subCategoryObject) {
            const dataArray = [];

            for (const [date, value] of Object.entries(subCategoryObject)) {
                dataArray.push({
                    label: moment(date).format('D MMM YY'),
                    value
                })
            }

            return dataArray;
        }

        /**
         * Функция обходит массив и получает имя по id.
         * @param categories - Массив объектов, в которых содержится соответствующий объект.
         * @param id - Идентификатор, по которому находится объект.
         * @returns {string|*} - Возвращаемое значение name найденного объекта.
         */
        function getCategoryName(categories, id) {
            let name = '';
            if (_.isArray(categories)) {
                for (const category of categories) {
                    if (String(_.get(category, 'id')) === String(id)) {
                        return _.get(category, 'name')
                    }
                    if (_.get(category, 'categories')) {
                        name = getCategoryName(_.get(category, 'categories'), id);

                        if (name) {
                            return name;
                        }
                    }
                }
            }
        }

        for (const [categoryId, categoryObject] of Object.entries(fetchedAppsData)) {
            for (const [subCategoryId, subCategoryObject] of Object.entries(categoryObject)) {
                chartData.push({
                    title: `${getCategoryName(fetchedCategories, categoryId)} - ${subCategoriesMap[subCategoryId]}`,
                    data: getDataValues(subCategoryObject),
                })
            }
        }

        return chartData;
    }

    return [];
}

const mapStateToProps = state => {
    return {
        ...state,
        fetchedAppsData: appsDataFormatted(state)
    };
};

const mapDispatchToProps = {
    fetchCountries,
    fetchCategories,
    selectCountryId,
    fetchAppsData
};

export default connect(mapStateToProps, mapDispatchToProps)(TopHistory);
