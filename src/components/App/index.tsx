import React from 'react';
import {memo} from "react";

export const App = memo((props) => {
    return (
        <div className="absolute size-20 bg-amber-400 top-0 left-0">
            Hello world!
        </div>
    );
});

export default App;
