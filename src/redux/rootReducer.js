import {combineReducers} from 'redux';
import {countryReducer} from './countryReducer';
import {categoriesReducer} from './categoriesReducer';
import {appsDataReducer} from "./appsDataReducer";

export const rootReducer = combineReducers({
    appsData: appsDataReducer,
    country: countryReducer,
    categories: categoriesReducer
});
