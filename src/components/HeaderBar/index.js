import React from 'react';
import {fetchCountries, fetchCategories, fetchAppsData, selectCountryId} from 'redux/actions';
import {connect} from 'react-redux';
import moment from 'moment';
import { DateRangePicker, DateRangeDelimiter  } from '@material-ui/pickers';
import {TextField, MenuItem, Select, ListItemIcon, ListItem, Box} from '@material-ui/core';
import _ from 'lodash';

class HeaderBar extends React.Component {
    /**
     * @param props - Возможно передать title, чтобы отобразить нужный заголовок, по-умолчанию - Top History.
     */
    constructor(props) {
        super(props);

        const startDate = moment().subtract(30, 'days');
        const currentDate = moment();

        this.minDate = startDate;
        this.maxDate = currentDate;
        this.state = {
            selectCountryId: "",
            startDate: startDate,
            endDate: currentDate,
            value: [startDate, currentDate]
        }
    }

    /**
     * Метод получения основных данных для графика по заданному значению дат и страны.
     * @param data - Массив дат, вида [startDate, endDate].
     */
    actionFetchAppsData(data) {
        const startDate = _.get(data, '[0]');
        const endDate = _.get(data, '[1]');

        if (startDate && endDate) {
            this.props.fetchAppsData({
                selectCountryId: this.state.selectCountryId || this.props.country.selectCountryId,
                dateRange: {
                    startDate: startDate.format('yyyy-MM-DD'),
                    endDate: endDate.format('yyyy-MM-DD'),
                }
            });
        }
    }

    render() {
        return (
            <Box justifyContent="space-between" display="flex" flexDirection="row" m={2}>
                <Box display="flex" alignItems="center">
                    <h3>
                        {this.props.title || 'Top History'}
                    </h3>
                </Box>
                <Box display="flex" flexDirection="row">
                    <Box mr={2}>
                        <Select
                            value={this.props.country.selectCountryId || ''}
                            renderValue={(value) => {
                                const selectCountry = this.props.country.fetchedCountries.find(country => {
                                    return String(_.get(country, 'id')) === String(value);
                                });

                                return <ListItem>
                                    <ListItemIcon>
                                        <img src={_.get(selectCountry, 'icon')} />
                                    </ListItemIcon>
                                    <div>
                                        {_.get(selectCountry, 'name')}
                                    </div>
                                </ListItem>
                            }}
                        >
                            {
                                this.props.country.fetchedCountries.map((country, i) => {
                                    return <MenuItem
                                        key={i}
                                        value={_.get(country, 'id')}
                                        onClick={() => {
                                            this.setState({selectCountryId: _.get(country, 'id')}, () => {
                                                this.actionFetchAppsData(this.state.value)
                                            });
                                            this.props.selectCountryId(_.get(country, 'id'));
                                        }}
                                    >
                                        <ListItemIcon>
                                            <img src={_.get(country, 'icon')} />
                                        </ListItemIcon>
                                        <div>
                                            {_.get(country, 'country')}
                                        </div>
                                    </MenuItem>
                                })
                            }
                        </Select>
                    </Box>
                    <Box display={{xs: "none", md: "block"}}>
                        <DateRangePicker
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField
                                        {...startProps}
                                        inputProps={{
                                            ..._.omit(startProps.inputProps, ['value', 'label', 'placeholder']),
                                            value: this.state.value[0]
                                                ? moment(this.state.value[0]).format('Do MMM YYYY')
                                                : '',
                                            readOnly: true,
                                        }}
                                        helperText={''}
                                    />
                                    <DateRangeDelimiter> to </DateRangeDelimiter>

                                    <TextField
                                        {...endProps}
                                        inputProps={{
                                            ..._.omit(startProps.inputProps, ['value', 'label', 'placeholder']),
                                            value: this.state.value[1]
                                                ? moment(this.state.value[1]).format('Do MMM YYYY')
                                                : '',
                                            readOnly: true,
                                        }}
                                        helperText={''}
                                    />
                                </React.Fragment>
                            )}
                            onChange={(date) => {
                                this.setState({value: date});
                                this.actionFetchAppsData(date);
                            }}
                            value={this.state.value}
                            maxDate={this.maxDate}
                            minDate={this.minDate}
                        />
                    </Box>
                </Box>
            </Box>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state,
        //Сортировка данных стран по алфавиту.
        fetchCountries: (_.get(state, 'country.fetchedCountries') || []).sort((countryA, countryB) => {
            const countryAName = String(_.get(countryA, 'country')).trim().toLowerCase();
            const countryBName = String(_.get(countryB, 'country')).trim().toLowerCase();

            if (countryAName > countryBName) {
                return 1;
            }
            if (countryAName < countryBName) {
                return -1;
            }

            return 0;
        })
    };
};

const mapDispatchToProps = {
    fetchCountries,
    fetchCategories,
    selectCountryId,
    fetchAppsData
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
