/**
 * Toolbox page
 */
import React, { useState } from 'react';
//external ressources
//react-bootatstrap components
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

//internal ressources
import SWCodeSearch from '../components/SWCodeSearch.jsx';
import SWCodeContainer from '../components/SWCodeContainer.jsx';
import SWBPSModel from '../components/SWBPSModel.jsx';

export default function Toolbox() {
  
  const [codes, setCodes] = useState({ "icf": [], "icd": [] });
  
  const updateCodesHandler = ( strCode, strType ) => {
      //push data into objects
      strType === 'icf' && setCodes( codes => ({ icf: [...codes.icf, strCode], icd: [...codes.icd] })); 
      strType === 'icd-10' && setCodes( codes => ({ icd: [...codes.icd, strCode], icf: [...codes.icf] })); 
  
      console.log('Update: ' + codes.update + ', Code State: ', codes);
  }
  
  const removeCodesHandler = ( strCode, strType ) => {
    //remove data from objects
    strType === 'icf' && setCodes( codes => ({ icf: codes.icf.filter(function (str) { return str !== strCode; }), icd: [...codes.icd] }));
    strType === 'icd' && setCodes( codes => ({ icd: codes.icd.filter(function (str) { return str !== strCode; }), icf: [...codes.icf] }));
    
    console.log( 'Remove triggered for: ' + strCode + ', type: ' + strType );
  }
    
  return (
    <div className="py-5">       
        <Tabs defaultActiveKey="codesearch" id="sw_toolbox_tabs" className="mb-3">
            <Tab eventKey="codesearch" title="Code">
                <h1 className="display-6 text-secondary text-center">ICD-10 - ICF Codesuche</h1>
                <SWCodeSearch 
                    buttonText = "Suchen!" 
                    handler = { updateCodesHandler }
                />            
            </Tab>
            <Tab eventKey="BPSModel" title="BPSM">
                <h1 className="display-6 text-secondary text-center">Biopsychosoziales Modell</h1>
                <SWBPSModel selectedCodes={ codes } className="my-4" />
            </Tab>            
        </Tabs>
        <SWCodeContainer 
            className="py-2"
            selectedCodes={ codes }
            removeHandler={ removeCodesHandler }
        />
    </div>
  );
}
