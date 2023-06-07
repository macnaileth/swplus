/**
 * Toolbox page
 */
import React, { useState, Suspense } from 'react';
//external ressources
//react-bootatstrap components
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Alert from 'react-bootstrap/Alert';

//internal ressources - old school
import LoadWait from '../components/LoadWait.jsx';
import Icons from '../lib/Icons';
/*
 * commented out because these are lazy loaded - will be removed soon
import SWCodeSearch from '../components/SWCodeSearch.jsx';
import SWCodeContainer from '../components/SWCodeContainer.jsx';
import SWBPSModel from '../components/SWBPSModel.jsx';
import SWICFDataExport from '../components/SWICFDataExport.jsx';
*/
//internal ressources - lazy load
const SWCodeSearch = React.lazy(() => import('../components/SWCodeSearch.jsx'));
const SWCodeContainer = React.lazy(() => import('../components/SWCodeContainer.jsx'));
const SWBPSModel = React.lazy(() => import('../components/SWBPSModel.jsx'));
const SWICFDataExport = React.lazy(() => import('../components/SWICFDataExport.jsx'));

export default function Toolbox() {
  
  const [codes, setCodes] = useState({ "icf": [], "icd": [], "pfactors": '' });
  
  const updateCodesHandler = ( strCode, strType, debug = false ) => {
      //push data into objects
      strType === 'icf' && !codes.icf.includes( strCode ) && setCodes( codes => ({ icf: [...codes.icf, strCode], icd: [...codes.icd], pfactors: codes.pfactors })); 
      strType === 'icd-10' &&  !codes.icd.includes( strCode ) && setCodes( codes => ({ icd: [...codes.icd, strCode], icf: [...codes.icf], pfactors: codes.pfactors }));
      strType === 'pfactors' && setCodes( codes => ({ icd: [...codes.icd], icf: [...codes.icf], pfactors: strCode })); 
  
      debug === true && console.log('Update, Code State: ', codes);
  };
  
  const removeCodesHandler = ( strCode, strType, debug = false ) => {
    //remove data from objects
    strType === 'icf' && setCodes( codes => ({ icf: codes.icf.filter(function (str) { return str !== strCode; }), icd: [...codes.icd], pfactors: codes.pfactors }));
    strType === 'icd' && setCodes( codes => ({ icd: codes.icd.filter(function (str) { return str !== strCode; }), icf: [...codes.icf], pfactors: codes.pfactors }));
    
    debug === true && console.log( 'Remove triggered for: ' + strCode + ', type: ' + strType );
  }; 
  
  return (
    <React.Fragment>
        <div className="pb-5 pt-2">  
            <Alert variant='warning' className='py-2 mb-5'>
                <div className="row">
                    <div className="col-10 col-md-11">
                        <b>Dies ist eine frühe "Test-und-Spiel-mit-mir"-Version.</b> Möglicherweise funktioniert vieles nicht wie erwartet. 
                    </div>
                    <div className="col-2 col-md-1 text-end">
                        <a href="https://github.com/macnaileth/swplus" target="_blank" rel="noopener noreferrer"><span className="icon-dark icon-btn">{ Icons.github }</span></a>
                    </div>
                </div>
            </Alert>        
            <Suspense fallback={ <LoadWait accessibilityMSG="Lade Toolbox..." LoadingMSG="Lade Toolbox - Bitte warten..."/> }>
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
                        <SWICFDataExport selectedCodes={ codes } />
                    </Tab>               
                </Tabs>
                <SWCodeContainer 
                    className="py-2"
                    selectedCodes={ codes }
                    removeHandler={ removeCodesHandler }
                />
            </Suspense>
        </div>
    </React.Fragment>
  );
}
