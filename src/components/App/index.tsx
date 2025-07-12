import React from 'react';
import {memo} from "react";
import {Button} from "antd";

export const App = memo((props) => {
    return (
        <div className="absolute size-20 bg-amber-400 top-0 left-0">
            <Button type="primary">Button</Button>
        </div>
    );
});

export default App;
