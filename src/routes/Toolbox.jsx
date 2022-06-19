/**
 * Toolbox page
 */

//external ressources
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import React from 'react'; //TODO: remove later when class externalized

//custom react classes
class SWCodeSearch extends React.Component {
    
};

export default function Toolbox() {
  return (
    <div className="py-3">       
        <Tabs defaultActiveKey="codesearch" id="sw_toolbox_tabs" className="mb-3">
            <Tab eventKey="codesearch" title="Code">
                <h1 className="display-6 text-secondary">ICD|ICF Codesuche</h1>
                Bla
            </Tab>
            <Tab eventKey="browseICD" title="ICD">
                <h1 className="display-6 text-secondary">ICD durchsuchen</h1>
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
