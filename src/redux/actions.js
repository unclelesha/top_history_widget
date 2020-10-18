import _ from 'lodash';
import {SET_SELECT_COUNTRY_ID} from './types';
import {FETCH_COUNTRIES} from './types';
import {FETCH_CATEGORIES} from './types';
import {FETCH_APPS_DATA} from './types';

export function fetchCountries(countries) {
    return async dispatch => {
        const response = await fetch('https://api.apptica.com/v1/geo?B4NKGg=fVN5Q9KVOlOHDx9mOsKPAQsFBlEhBOwguLkNEDTZvKzJzT3l');
        const json = await response.json();

        dispatch({
            type: FETCH_COUNTRIES,
            payload: json && typeof json === 'object' && json.data
        })
    }
}

export function selectCountryId(countryId) {
    return {
        type: SET_SELECT_COUNTRY_ID,
        payload: countryId
    }
}

export function fetchCategories() {
    return async dispatch => {
        const response = await fetch('https://api.apptica.com/v1/applicationCategory?platform=1&B4NKGg=fVN5Q9KVOlOHDx9mOsKPAQsFBlEhBOwguLkNEDTZvKzJzT3l');
        const json = await response.json();

        dispatch({
            type: FETCH_CATEGORIES,
            payload: json && typeof json === 'object' && json.data
        })
    }
}

export function fetchAppsData(objParam) {
    return async (dispatch) => {
        const dateFrom = _.get(objParam, 'dateRange.startDate');
        const dateTo = _.get(objParam, 'dateRange.endDate');
        const selectCountryId = _.get(objParam, 'selectCountryId');

        const response = await fetch(`https://api.apptica.com/package/top_history/9379/${selectCountryId}?date_from=${dateFrom}&date_to=${dateTo}&platforms=1&B4NKGg=fVN5Q9KVOlOHDx9mOsKPAQsFBlEhBOwguLkNEDTZvKzJzT3l`);
        const json = await response.json();

        dispatch({
            type: FETCH_APPS_DATA,
            payload: json && typeof json === 'object' && json.data
        })
    }
}
