import React from 'react';
import TopHistory from './widgets/TopHistory/index.js';
import './App.css';
import {Box} from "@material-ui/core";

function App() {
    return (
        <Box p={4} className="App">
            <TopHistory />
        </Box>
    );
}

export default App;
