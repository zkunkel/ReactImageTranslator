import React, { useState } from 'react';

import './TranslationSettings.css';

export default function TranslationSettings() {

    const [translator, setTranslator] = useState('Google Translate');
    const [fromLang, setFromLang] = useState('JP');
    const [toLang, setToLang] = useState('EN');

    const translatorChanged = (event) => { setTranslator(event.target.value); };
    const fromLangChanged = (event) => { setFromLang(event.target.value); };
    const toLangChanged = (event) => { setToLang(event.target.value); };

    return (
        <div>
            <h2 style={{ margin: '8px' }}>Translation Settings</h2>

            <label className="dropdownLabel" htmlFor="translator">Translation Service</label>
            <select id="translator" value={translator} onChange={translatorChanged}>
                <option value="option1">Google Translate</option>
                <option value="option2">DeepL</option>
                <option value="option3">Local translation model Sugoi</option>
            </select>


            <div style={{ display: 'flex', alignItems: 'center', gap: '0px', padding: '7px' }}>

                <label className="dropdownLabel" htmlFor="fromLang">From</label>
                <select id="fromLang" value={fromLang} onChange={fromLangChanged}>
                    <option value="option1">JP</option>
                </select>

                <label className="dropdownLabel" htmlFor="toLang">To</label>
                <select id="toLang" value={toLang} onChange={toLangChanged}>
                    <option value="option1">EN</option>
                </select>
                
            </div>
        </div>
    );
}
