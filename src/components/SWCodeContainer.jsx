/**
 * SWCodeContainer React Component: Place where the selected codes are kept.
 */
//external ressources
import React from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import _ from "lodash";

//internal ressources
import Icons from '../lib/Icons';

class SWCodeContainer extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { open: false };
        this.opencloseHandle = this.opencloseHandle.bind(this);
    }
    opencloseHandle = () => this.state.open === true ? this.setState({ open: false }) : this.state.open === false ? this.setState({ open: true }) : null;
    render() {
        
        return ( 
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
                      <Collapse in={this.state.open}>
                        <div id="sw-code-container" className={ !_.isEmpty( this.props.className ) ? this.props.className + ' code-container' : 'code-container' }>
                          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                          terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                          labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                      </Collapse>
                    </div>                
                );
    }
};

export default SWCodeContainer;
