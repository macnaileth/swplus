/**
 * ICF BPSM Data export component
 */
//external ressources
import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class SWICFDataExport extends React.Component {
    
    render() {            
            return (
                    <div>
                        <p className="text-start text-lg-center">Aus den ausgewählten Daten kann ein Export zu einem PDF oder Office-Dokument durchgeführt werden. Dazu können die untenstehenden Optionen ggf. angepasst werden.</p>
                        <div className="d-md-flex d-block mb-3 py-3 border-bottom border-top justify-content-center gap-2">
                            <div>
                                <h3>Zu exportierende Daten</h3>
                                <Form.Check 
                                    type="switch"
                                    id="sw_icd10_switch"
                                    label="ICD-10 Diagnoseschlüssel und -bezeichnungen exportieren"
                                    defaultChecked={ true } 
                                />     
                                <Form.Check 
                                    type="switch"
                                    id="sw_icf_codes_switch"
                                    label="ICF Codes und -bezeichnungen exportieren"
                                    defaultChecked={ true } 
                                /> 
                                <Form.Check 
                                    type="switch"
                                    id="sw_icf_pfactors_switch"
                                    label="ICF - Persönliche Faktoren im Export beinhalten"
                                />       
                                <Form.Check 
                                    type="switch"
                                    id="sw_bpsm_switch"
                                    label="Biopsychosoziales Modell im Export inkludieren"
                                />
                            </div>
                            <div>
                                <h3>Layoutoptionen</h3>
                                <Form.Check 
                                    type="switch"
                                    id="sw_icf_grad_switch"
                                    label="Felder für ICF-Beurteilungsmerkmale (Format [code]._ _) vorsehen"
                                    defaultChecked={ true } 
                                />     
                                <Form.Check 
                                    type="switch"
                                    id="sw_remarks_switch"
                                    label="Anmerkungsfelder bei den Kodierungen vorsehen"
                                    defaultChecked={ true } 
                                /> 
                                <Form.Check 
                                    type="switch"
                                    id="sw_icf_pfactors_switch"
                                    label="5 Zeilen für Persönliche Faktoren vorsehen"
                                    defaultChecked={ true } 
                                /> 
                                <Form.Check 
                                    type="switch"
                                    id="sw_bpsm_switch"
                                    label="5 Zeilen für Kommentare vorsehen"
                                    defaultChecked={ true } 
                                />
                            </div>                            
                        </div>
                        <div className="d-md-flex d-block mb-3 pb-3 border-bottom justify-content-center gap-2">
                            <div>
                                <h3>Dokumentenart</h3>
                                <Form.Check 
                                    type="switch"
                                    inline
                                    id="sw_icf_list_switch"
                                    label="ICF-Liste erstellen"
                                    defaultChecked={ true } 
                                />     
                                <Form.Check 
                                    type="switch"
                                    inline
                                    id="sw_needs_switch"
                                    label="Liste zur Vorbereitung der Bedarfserhebung erstellen"
                                    defaultChecked={ false } 
                                />       
                                <Form.Select aria-label="Formatauswahl" className="mt-2">
                                    <option>Ausgabe im Format:</option>
                                    <option value="PDF">PDF Dokument</option>
                                    <option value="DOCX">Word Dokument</option>
                                </Form.Select>
                            </div>                         
                        </div>
                        <div className="d-grid d-md-flex justify-content-md-center gap-2 mb-4">
                            <Button variant="primary">Dokument erzeugen</Button>
                            <Button variant="dark">Einstellungen zurücksetzen</Button>
                        </div>
                    </div>
                   );               
    }
};

export default SWICFDataExport;
