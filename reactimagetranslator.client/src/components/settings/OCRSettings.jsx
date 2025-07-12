import React, { useState } from 'react';

import './OCRSettings.css';

//https://www.jaided.ai/easyocr/documentation/

export default function OCRSettings() {

    const [x_ths, setX_ths] = useState(0.05);
    const [y_ths, setY_ths] = useState(0.5);
    const [ycenter_ths, setYcenter_ths] = useState(0.1);
    const [width_ths, setWidth_ths] = useState(0.5);
    const [height_ths, setHeight_ths] = useState(0.4);
    const [min_size, setMin_size] = useState(52);
    const [add_margin, setAdd_margin] = useState(0.1);

    const x_thsChange = (event) => { setX_ths(event.target.value); };
    const y_thsChange = (event) => { setY_ths(event.target.value); };
    const ycenter_thsChange = (event) => { setYcenter_ths(event.target.value); };
    const width_thsChange = (event) => { setWidth_ths(event.target.value); };
    const height_thsChange = (event) => { setHeight_ths(event.target.value); };
    const min_sizeChange = (event) => { setMin_size(event.target.value); };
    const add_marginChange = (event) => { setAdd_margin(event.target.value); };

    const resetSettings = (event) => {
        setX_ths(0.05)
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px' }}>
                <h2 style={{ margin: '4px' }}>OCR Settings</h2>
                <button onClick={resetSettings} style={{ margin: '2px' }}>Reset</button>
            </div>
            

            <div className="settingsFlex">
                <div className="settingsCol">
                    <label htmlFor="x_ths">x_ths = {Number(x_ths).toFixed(2)}</label>
                    <input id="x_ths" type="range" min="0.05" max="1" step="0.05" value={x_ths} onChange={x_thsChange} />

                    <label htmlFor="width_ths">width_ths = {Number(width_ths).toFixed(2)}</label>
                    <input id="width_ths" type="range" min="0.05" max="1" step="0.05" value={width_ths} onChange={width_thsChange} />

                    <label htmlFor="ycenter_ths">ycenter_ths = {Number(ycenter_ths).toFixed(2)}</label>
                    <input id="ycenter_ths" type="range" min="0.05" max="1" step="0.05" value={ycenter_ths} onChange={ycenter_thsChange} />

                    <label htmlFor="min_size">min_size = {min_size}</label>
                    <input id="min_size" type="range" min="0" max="100" step="1" value={min_size} onChange={min_sizeChange} />
                </div>

                <div className="settingsCol">
                    <label htmlFor="y_ths">y_ths = {Number(y_ths).toFixed(2)}</label>
                    <input id="y_ths" type="range" min="0.05" max="1" step="0.05" value={y_ths} onChange={y_thsChange} />

                    <label htmlFor="height_ths">height_ths = {Number(height_ths).toFixed(2)}</label>
                    <input id="height_ths" type="range" min="0.05" max="1" step="0.05" value={height_ths} onChange={height_thsChange} />

                    <label htmlFor="add_margin">add_margin = {Number(add_margin).toFixed(2)}</label>
                    <input id="add_margin" type="range" min="0.05" max="1" step="0.05" value={add_margin} onChange={add_marginChange} />
                </div>
            </div>
        </div>
    );
}