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
import SWICFDataExport from '../components/SWICFDataExport.jsx';

export default function Toolbox() {
  
  const [codes, setCodes] = useState({ "icf": [], "icd": [], "pfactors": '' });
  
  const updateCodesHandler = ( strCode, strType ) => {
      //push data into objects
      strType === 'icf' && !codes.icf.includes( strCode ) && setCodes( codes => ({ icf: [...codes.icf, strCode], icd: [...codes.icd], pfactors: codes.pfactors })); 
      strType === 'icd-10' &&  !codes.icd.includes( strCode ) && setCodes( codes => ({ icd: [...codes.icd, strCode], icf: [...codes.icf], pfactors: codes.pfactors }));
      strType === 'pfactors' && setCodes( codes => ({ icd: [...codes.icd], icf: [...codes.icf], pfactors: strCode })); 
  
      console.log('Update, Code State: ', codes);
  }
  
  const removeCodesHandler = ( strCode, strType ) => {
    //remove data from objects
    strType === 'icf' && setCodes( codes => ({ icf: codes.icf.filter(function (str) { return str !== strCode; }), icd: [...codes.icd], pfactors: codes.pfactors }));
    strType === 'icd' && setCodes( codes => ({ icd: codes.icd.filter(function (str) { return str !== strCode; }), icf: [...codes.icf], pfactors: codes.pfactors }));
    
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
                <h1 className="display-6 text-secondary text-center">Biopsychosoziales Modell der ICF</h1>
                <SWBPSModel 
                    selectedCodes={ codes } 
                    className="my-4"
                    handler = { updateCodesHandler }
                />
            </Tab>   
            <Tab eventKey="listexport" title="Export">
                <h1 className="display-6 text-secondary text-center">Daten exportieren</h1>
                <SWICFDataExport />
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
