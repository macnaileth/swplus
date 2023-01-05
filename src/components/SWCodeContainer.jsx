/**
 * SWCodeContainer React Component: Place where the selected codes are kept.
 */
//external ressources
import React from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from 'react-bootstrap/ListGroup';
import _ from "lodash";

//internal ressources
import Icons from '../lib/Icons';
import IconPopover from '../components/IconPopover';
import ManParse from '../lib/ManParse';

//json manuals
import manualsWHO from '../lib/manuals';
Object.freeze(manualsWHO);

class SWCodeContainer extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { open: false, update: 0 };
        this.opencloseHandle = this.opencloseHandle.bind(this);
        this.displayCodes = this.displayCodes.bind(this);
        
        //declare icd/icf parser for use
        this.parser = new ManParse(manualsWHO);
    }
    
    opencloseHandle = () => this.state.open === true ? this.setState({ open: false }) : this.state.open === false ? this.setState({ open: true }) : null;
    
    displayCodes = ( array, type = 'icd' ) => {
        return (
                    <div className="p-2">
                        <h5>{ type === 'icd' ? 'ICD-10 Codes' : type === 'icf' ? 'ICF Codes' : null }</h5>
                        <ListGroup className="sw-code-list" variant="flush">
                            { array.map((element, index) => ( <ListGroup.Item action key={ index + '_' + element }>
                                                                <div className="d-flex justify-content-between">
                                                                    <div className="sw-code-list-item">{ element }</div>
                                                                    <div className="sw-code-list-icons">
                                                                        <IconPopover className="icon-info sw-help-icon"
                                                                                     placement="top"
                                                                                     id={ 'sw_info_' + element }
                                                                                     headerText={ type === 'icd' ? 'ICD-10 Code: ' + element : type === 'icf' ? 'ICF Code: ' + element : 'sonstiger Code: ' + element }
                                                                                     bodyText={ type === 'icd' ? this.parser.icdTitle( element, 180 ).title : type === 'icf' ? this.parser.icfTitle( element, 180 ) : 'unbekannter Code' }
                                                                                     icon={ Icons.help }
                                                                                     
                                                                        />  
                                                                        <span className="icon-danger sw-remove-icon"
                                                                              onClick={ () => this.props.removeHandler( element, type ) } >
                                                                                { Icons.remove }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                              </ListGroup.Item> )) }
                        </ListGroup>
                    </div>
               );
        
    }

    render() {
        return (    <React.Fragment>
                        <div className={ this.props.className }>
                            <div className="d-grid gap-2">
                                <Button
                                  onClick={ () => this.opencloseHandle() }
                                  aria-controls="sw-code-container"
                                  aria-expanded={this.state.open}
                                  variant="secondary"
                                >
                                    <span className="icon-black icon-btn">{ Icons.clipboard }</span>
                                    Ausgewählte Codes anzeigen
                                </Button>
                            </div>
                          <Collapse in={ this.state.open }>
                            <div id="sw-code-container" className={ !_.isEmpty( this.props.className ) ? this.props.className + ' code-container row mx-1 border rounded-bottom border-top-0' : 'code-container row mx-1 border rounded-bottom border-top-0' }>
                               { _.isEmpty( this.props.selectedCodes.icf ) && _.isEmpty( this.props.selectedCodes.icd ) && 
                                       <div className="fw-bold text-center code-container-no-code">Keine Codes ausgewählt. Wählen Sie Codes aus, um diese im Biopsychosozialen Modell oder den ICF-Listen zu verwenden.</div> }
                               { !_.isEmpty( this.props.selectedCodes.icf ) && <div className="col code-container-icf">{ this.displayCodes(this.props.selectedCodes.icf, 'icf') }</div> }
                               { !_.isEmpty( this.props.selectedCodes.icd ) && <div className="col code-container-icd">{ this.displayCodes(this.props.selectedCodes.icd, 'icd') }</div> }
                               { !_.isEmpty( this.props.selectedCodes.pfactors ) && 
                                        <div className="col-12 code-container-pfactors border-top pt-1">
                                            <div className="p-2">
                                                <h5>Persönliche Faktoren</h5>
                                                <p><em>{ this.props.selectedCodes.pfactors }</em></p>
                                            </div>
                                        </div> }
                            </div>
                          </Collapse>
                        </div> 
                    </React.Fragment>
                );
    }
};

export default SWCodeContainer;
