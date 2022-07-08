/**
 * Toolbox page
 */

//external ressources
//react-bootatstrap components
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

//internal ressources
import SWCodeSearch from '../components/SWCodeSearch.jsx';

export default function Toolbox() {
  return (
    <div className="py-5">       
        <Tabs defaultActiveKey="codesearch" id="sw_toolbox_tabs" className="mb-3">
            <Tab eventKey="codesearch" title="Code">
                <h1 className="display-6 text-secondary">ICD-10 - ICF Codesuche</h1>
                <SWCodeSearch 
                    buttonText ="Suchen!"
                />
            </Tab>
            <Tab eventKey="browseICD" title="ICD-10">
                <h1 className="display-6 text-secondary">ICD-10 durchsuchen</h1>
                Blabla
            </Tab>
            <Tab eventKey="browseICF" title="ICF">
                <h1 className="display-6 text-secondary">ICF durchsuchen</h1>
                Blubb
            </Tab>
            <Tab eventKey="BPSModel" title="BPSM">
                <h1 className="display-6 text-secondary">Biopsychosoziales Modell</h1>
                BlubberBlubb
            </Tab>            
        </Tabs>
    </div>
  );
}
