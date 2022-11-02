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

//lodash
import _ from "lodash";

export default function Toolbox() {
  
  const [codes, setCodes] = useState({ "icf": [], "icd": [] });
  
  const updateCodesHandler = ( strCode, strDesc ) => {
      //push data into objects
      strDesc === 'icf' && setCodes( codes => ({ icf: [...codes.icf, strCode], icd: [...codes.icd] })); 
      strDesc === 'icd-10' && setCodes( codes => ({ icd: [...codes.icd, strCode], icf: [...codes.icf] })); 
  
      console.log('Update: ' + codes.update + ', Code State: ', codes);
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
                <h1 className="display-6 text-secondary">Biopsychosoziales Modell</h1>
                BlubberBlubb
            </Tab>            
        </Tabs>
        <SWCodeContainer 
            className="py-2"
            selectedCodes={ codes }
        />
    </div>
  );
}
