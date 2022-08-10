/**
 * Toolbox page
 */

//external ressources
//react-bootatstrap components
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

//internal ressources
import SWCodeSearch from '../components/SWCodeSearch.jsx';
import SWCodeContainer from '../components/SWCodeContainer.jsx';

export default function Toolbox() {
  
  return (
    <div className="py-5">       
        <Tabs defaultActiveKey="codesearch" id="sw_toolbox_tabs" className="mb-3">
            <Tab eventKey="codesearch" title="Code">
                <h1 className="display-6 text-secondary text-center">ICD-10 - ICF Codesuche</h1>
                <SWCodeSearch buttonText ="Suchen!" />            
            </Tab>
            <Tab eventKey="BPSModel" title="BPSM">
                <h1 className="display-6 text-secondary">Biopsychosoziales Modell</h1>
                BlubberBlubb
            </Tab>            
        </Tabs>
        <SWCodeContainer 
            className="mt-3"
        />
    </div>
  );
}
