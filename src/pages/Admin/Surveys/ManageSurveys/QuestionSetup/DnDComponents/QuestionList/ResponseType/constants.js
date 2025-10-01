export const checkboxStyleString = `
                               .custom-blue-radio {
                                 position: relative;
                                 display: inline-block;
                                 width: 18px;
                                 height: 18px;
                               }
                         
                               .custom-blue-radio input[type="radio"] {
                                 opacity: 0;
                                 position: absolute;
                                 width: 28px;
                                 height: 28px;
                                 margin: 0;
                                 left: 0;
                                 top: 0;
                                 z-index: 2;
                                 cursor: pointer;
                               }
                         
                               .custom-blue-radio .custom-radio-mark {
                                 position: absolute;
                                 top: 0;
                                 left: 0;
                                 width: 20px;
                                 height: 20px;
                                 border-radius: 50%;
                                 border: 2px solid #bbbb;
                                 background: #fff;
                                 pointer-events: none;
                                 transition: border 0.2s ease;
                               }
                         
                               .custom-blue-radio input[type="radio"]:checked ~ .custom-radio-mark {
                                 border-color: #0968AC;
                                 width: 23px;
                                 height: 23px;
                               }
                         
                               .custom-blue-radio input[type="radio"]:checked ~ .custom-radio-mark::after {
                                 content: "";
                                 display: block;
                                 position: absolute;
                                 top: 5.5px;
                                 left: 5.5px;
                                 width: 8px;
                                 height: 8px;
                                 border-radius: 50%;
                                 background: #fff;
                                 box-shadow: 0 0 0 4px #0968AC;
                               }
                             `;
