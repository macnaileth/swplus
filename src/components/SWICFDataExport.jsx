/**
 * ICF BPSM Data export component
 */
//external ressources
import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//internal ressources
import ICFListPDF from '../lib/ICFListPDF';

//inital state
const initalState = {
    icd10: true,
    icf: true,
    pfactors: false,
    bpsm: false,
    gradfields: true,
    remfields: true,
    pfacfields: true,
    commfields: true,
    icflist: true,
    ndlist: false,
    message: '',
    messagelvl: ''
};

class SWICFDataExport extends React.Component {
    
    constructor(props) {
        super(props); 
        
        this.state = initalState;
        
        this.pdf = new ICFListPDF;
        
        this.verifySwitch = this.verifySwitch.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }
    
    resetForm = () => {
        //handle icf list switch extra
        document.getElementById('sw_icf_list_switch').disabled = false;
        document.getElementById('sw_icf_list_switch').checked = true;
        document.getElementById('sw_create_doc_btn').disabled = false;
        document.getElementById("sw_create_doclist").reset();
        //reset states also!
        this.setState({ initalState });
        console.log( 'Reseted state:', this.state );
    }
    
    verifySwitch = ( strSwitch, checked ) => {
        //set state and produce warnings if needed
        const warning = {msg: '', msglvl: ''};
        //get icf list
        const icflist = document.getElementById('sw_icf_list_switch');
        //get ndlist
        const ndlist = document.getElementById('sw_needs_switch');
        //get button
        const createbtn = document.getElementById('sw_create_doc_btn');
        //icd10
        if( strSwitch === 'icd10' ){
            //check if warning is neeeded
            if (checked === true ) {
                warning.msg = ''; 
                warning.msglvl = '';
            }else { 
                warning.msg = 'Ohne ICD-10 Schlüssel ist das Dokument ggf. unvollständig. Ein entsprechendes Feld zum Eintrag von Diagnosen wird eingefügt.';
                warning.msglvl = 'info';
            }
            
            this.setState({ icd10: checked, message: warning.msg, messagelvl: warning.msglvl });
        }
        //icf
        if( strSwitch === 'icf' ){
            //check if warning is neeeded            
            if (checked === true ) {
                warning.msg = ''; 
                warning.msglvl = '';
            }else { 
                warning.msg = 'Ohne ICF Codes kann ggf. keine valide ICF-Liste erzeugt werden.';
                warning.msglvl = 'warning';
            }
            
            this.setState({ icf: checked, message: warning.msg, messagelvl: warning.msglvl });
        }     
        //personal factors
        if( strSwitch === 'pfactors' ){
            this.setState({ pfactors: checked, message: '', messagelvl: '' });
        }     
        //bpsm
        if( strSwitch === 'bpsm' ){
            this.setState({ bpsm: checked, message: '', messagelvl: '' });
        }          
        //graduation
        if( strSwitch === 'gradfields' ){
            //check if warning is neeeded
            if (checked === true ) {
                warning.msg = ''; 
                warning.msglvl = '';
            }else { 
                warning.msg = 'Eine Nichtanwendung der Beurteilungsmerkmale entspricht nicht der Kodierungsleitlinie der ICF (siehe Anhang 2 der ICF): Die ICF-Kodes erfordern die Verwendung mindestens eines Beurteilungsmerkmals. ';
                warning.msglvl = 'warning';
            }
            
            this.setState({ gradfields: checked, message: warning.msg, messagelvl: warning.msglvl });
        }    
        //remarks
        if( strSwitch === 'remfields' ){
            this.setState({ remfields: checked, message: '', messagelvl: '' });
        }  
        //pfactors
        if( strSwitch === 'pfacfields' ){
            this.setState({ pfacfields: checked, message: '', messagelvl: '' });
        }    
        //comments
        if( strSwitch === 'commfields' ){
            this.setState({ commfields: checked, message: '', messagelvl: '' });
        }     
        
        console.log( 'Switch: ' + strSwitch + ', checked: ' + checked );
    }
    
    render() {            
            return (
                    <div>
                        <p className="text-start text-lg-center">Aus den ausgewählten Daten kann ein Export zu einem PDF-Dokument durchgeführt werden. Dazu können die untenstehenden Optionen ggf. angepasst werden.</p>
                        {this.state.message !== '' &&
                            <div className="my-3">
                                <div className={ "alert alert-" + this.state.messagelvl } role="alert">
                                    <p className="text-start text-lg-center mb-0">{ this.state.message }</p>
                                </div>  
                            </div>
                        }
                        <Form id="sw_create_doclist">  
                            <div className="d-md-flex d-block mb-3 py-3 border-bottom border-top justify-content-center gap-2">
                                <div>
                                    <h3>Zu exportierende Daten</h3>
                                    <Form.Check 
                                        type="switch"
                                        id="sw_icd10_switch"
                                        label="ICD-10 Diagnoseschlüssel und -bezeichnungen exportieren"
                                        defaultChecked={ true } 
                                        value="icd10"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    />     
                                    <Form.Check 
                                        type="switch"
                                        id="sw_icf_codes_switch"
                                        label="ICF Codes und -bezeichnungen exportieren"
                                        defaultChecked={ true } 
                                        value="icf"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    /> 
                                    <Form.Check 
                                        type="switch"
                                        id="sw_icf_pfactors_switch"
                                        label="ICF - personenbezogene Faktoren im Export beinhalten"
                                        value="pfactors"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    />       
                                    <Form.Check 
                                        type="switch"
                                        id="sw_bpsm_switch"
                                        label="Biopsychosoziales Modell im Export inkludieren"
                                        value="bpsm"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    />
                                </div>
                                <div>
                                    <h3>Layoutoptionen</h3>
                                    <Form.Check 
                                        type="switch"
                                        id="sw_icf_grad_switch"
                                        label="Felder für ICF-Beurteilungsmerkmale (Format [code]._ _) vorsehen"
                                        defaultChecked={ true } 
                                        value="gradfields"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    />     
                                    <Form.Check 
                                        type="switch"
                                        id="sw_remarks_switch"
                                        label="Anmerkungsfelder bei den Kodierungen vorsehen"
                                        defaultChecked={ true } 
                                        value="remfields"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    /> 
                                    <Form.Check 
                                        type="switch"
                                        id="sw_icf_pfactors_switch"
                                        label="5 Zeilen für personenbezogene Faktoren vorsehen"
                                        defaultChecked={ true } 
                                        value="pfacfields"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    /> 
                                    <Form.Check 
                                        type="switch"
                                        id="sw_bpsm_switch"
                                        label="5 Zeilen für Kommentare vorsehen"
                                        defaultChecked={ true } 
                                        value="commfields"
                                        onChange={ ( event ) => this.verifySwitch( event.target.value, event.target.checked ) }
                                    />
                                </div>                            
                            </div>
                            <div className="d-grid d-md-flex justify-content-md-center gap-2 mb-4">
                                <Button id="sw_create_doc_btn" 
                                        variant="primary"
                                        onClick={ () => this.pdf.createPDFfromData( 'sw-list-', this.state, this.props.selectedCodes ) }>Dokument erzeugen</Button>
                                <Button variant="dark"
                                        onClick={ () => this.resetForm() }>Einstellungen zurücksetzen</Button>
                            </div>
                        </Form>
                    </div>
                   );               
    }
};

export default SWICFDataExport;
