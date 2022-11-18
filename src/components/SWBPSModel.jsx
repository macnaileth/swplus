/**
 * BPSM class to create the bio psycho social model of the icf by using selected icd/icf-codes
 */
import React from 'react';

//third party stuff
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import _ from "lodash";

class BPSMPersonalFactors extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { show: false, pfactors: '' };
    }
    render() {        
        return (
            <React.Fragment>
                <Modal
                    show={ this.state.show }
                    onHide={ () => this.setState({ show: false }) }
                    size="lg"
                    aria-labelledby="sw_bpsm_modal_pfactors"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="sw_bpsm_modal_pfactors">
                          Persönliche Faktoren
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="my-2">
                            <textarea   type="text" 
                                        value={ this.state.pfactors }
                                        onChange={ ( event ) => this.setState( { pfactors: event.target.value }, () => this.props.handler( this.state.pfactors, 'pfactors' ) ) }
                                        className="form-control" 
                                        id="sw_bpsm_pf_input" 
                                        placeholder='Persönliche Faktoren hier eingeben' />
                        </div>
                    </Modal.Body>
                </Modal>
                <div className="d-grid gap-2">
                   <Button variant="outline-dark" onClick={() => this.setState({ show: true })}>
                       Bearbeiten
                   </Button>
                </div>  
            </React.Fragment>
        );      
    }
}

export class SWBPSModel extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.bpsmCard = this.bpsmCard.bind(this);
        this.bpsmArrowStraight = this.bpsmArrowStraight.bind(this);
        this.bpsmArrowSetUpper = this.bpsmArrowSetUpper.bind(this);
        this.bpsmArrowSetLower = this.bpsmArrowSetLower.bind(this);
        this.bpsmArrowSetLowest = this.bpsmArrowSetLowest.bind(this);
        this.codeListStr = this.codeListStr.bind(this);
        this.splitICFCodes = this.splitICFCodes.bind(this);
        this.bpsmBodyText = this.bpsmBodyText.bind(this);
    }
    
    bpsmCard = ( titleStr, bodyContent, cssHead = '', cardCSS = '', pWrap = true ) => {
        return (
            <Card className={ cardCSS === '' ? "mx-0 mx-md-2 sw-bpsm-card shadow-sm" : "mx-0 mx-md-2 sw-bpsm-card shadow-sm " + cardCSS } >
                <Card.Header className={ cssHead === '' ? 'sw-bpsm-card-header' : 'sw-bpsm-card-header ' + cssHead }><strong>{ titleStr }</strong></Card.Header>
                <Card.Body>
                    { pWrap === true ? <Card.Text> 
                        { bodyContent }
                        </Card.Text> : <React.Fragment>{ bodyContent }</React.Fragment> }                  
                </Card.Body>
            </Card>        
            );
    }
    
    bpsmArrowStraight = ( cssStyles ) => {
        return (
            <div className={ "sw-bpsm-arrow-straight d-none d-md-flex justify-content-between align-items-center" + ( cssStyles ? ' ' + cssStyles : '' ) }>
                <div className="sw-bpsm-arrowhead-left arrow">
                    <svg height="30" width="15">
                        <polygon points="15,5 0,15 15,25" />
                    </svg>
                </div>   
                <div className="sw-bpsm-arrow-horizontal arrow">
                    <svg viewBox="0 0 100 30">
                      <polygon points="0,14 500,14 500,16 0,16" />
                    </svg>    
                </div>
                <div className="sw-bpsm-arrowhead-right arrow">
                    <svg height="30" width="15">
                        <polygon points="0,5 15,15 0,25" />
                    </svg>
                </div>
            </div>
        );
    }

    bpsmArrowSetUpper = ( cssStyles ) => {
        return (
            <div className={ "sw-bpsm-arrow-set-upper d-none d-md-flex justify-content-center" + ( cssStyles ? ' ' + cssStyles : '' ) }>
                <div className="sw-bpsm-arrowhead-down first arrow">
                    <svg height="55" width="30">
                        <polygon points="14,0 14,40 5,40 15,55 25,40 16,40 16,0" />
                    </svg>
                </div>              
                <div className="sw-bpsm-arrow-horizontal arrow">
                    <svg viewBox="0 0 500 30">
                      <polygon points="0,13 1000,13 1000,15 0,15" />
                    </svg>    
                </div>
                <div className="sw-bpsm-arrowhead-updown center arrow">
                     <svg height="80" width="30">
                        <polygon points="14,15 14,65 5,65 15,80 25,65 16,65 16,15 25,15 15,0 5,15" />
                    </svg>       
                </div>
                <div className="sw-bpsm-arrow-horizontal arrow">
                    <svg viewBox="0 0 500 30">
                      <polygon points="0,13 1000,13 1000,15 0,15" />
                    </svg>    
                </div>                
                <div className="sw-bpsm-arrowhead-down last arrow">
                    <svg height="55" width="30">
                        <polygon points="14,0 14,40 5,40 15,55 25,40 16,40 16,0" />
                    </svg>
                </div>                    
            </div>
        );
    }  
    
    bpsmArrowSetLower = ( cssStyles ) => {
        return (
            <div className={ "sw-bpsm-arrow-set-lower d-none d-md-flex justify-content-center" + ( cssStyles ? ' ' + cssStyles : '' ) }>
                <div className="sw-bpsm-arrowhead-up first arrow">
                    <svg height="45" width="30">
                        <polygon points="14,15 14,45 16,45 16,15 25,15 15,0 5,15" />
                    </svg>
                </div>              
                <div className="sw-bpsm-arrow-horizontal arrow">
                    <svg viewBox="0 0 500 30">
                      <polygon points="0,13 1000,13 1000,15 0,15" />
                    </svg>    
                </div>
                <div className="sw-bpsm-arrowhead-down center arrow">
                     <svg height="80" width="30">
                        <polygon points="14,15 14,78 16,78 16,15 25,15 15,0 5,15" />
                    </svg>       
                </div>
                <div className="sw-bpsm-arrow-horizontal arrow">
                    <svg viewBox="0 0 500 30">
                      <polygon points="0,13 1000,13 1000,15 0,15" />
                    </svg>    
                </div>                
                <div className="sw-bpsm-arrowhead-up last arrow">
                    <svg height="45" width="30">
                        <polygon points="14,15 14,45 16,45 16,15 25,15 15,0 5,15" />
                    </svg>
                </div>                    
            </div>
        );
    }
    
    bpsmArrowSetLowest = ( cssStyles ) => {
        return (
            <div className={ "sw-bpsm-arrow-set-lowest d-none d-md-flex justify-content-center" + ( cssStyles ? ' ' + cssStyles : '' ) }>
                <div className="sw-bpsm-arrowhead-down first arrow">
                    <svg height="55" width="30">
                        <polygon points="14,0 14,40 5,40 15,55 25,40 16,40 16,0" />
                    </svg>
                </div>              
                <div className="sw-bpsm-arrow-horizontal arrow">
                    <svg viewBox="0 0 500 30">
                      <polygon points="0,13 1000,13 1000,15 0,15" />
                    </svg>    
                </div>           
                <div className="sw-bpsm-arrowhead-down last arrow">
                    <svg height="55" width="30">
                        <polygon points="14,0 14,40 5,40 15,55 25,40 16,40 16,0" />
                    </svg>
                </div>                    
            </div>
        );
    }     
    
    codeListStr = ( codeArray, css ) => {
        return (
            <React.Fragment>
                { !_.isEmpty(codeArray) &&
                        codeArray.map((element, index, array) => (<span key={ index } className={ css } >{ element + (index === array.length - 1 ? '' : ', ')}</span>))
                        }
            </React.Fragment>
        );
    }
    
    splitICFCodes = ( codeArray ) => {
        
        const sortedCodes = {   
                                "bsCodes": [], 
                                "eCodes": [],
                                "aCodes": [],
                                "pCodes": []
                            };
        
        !_.isEmpty(codeArray) && codeArray.map(( element ) => {  
            
            let firstChar = element.charAt(0);
            let secChar = element.charAt(1);
            
            if (firstChar === 'b' || firstChar === 's') {
                sortedCodes.bsCodes.push( element );
            } else if (firstChar === 'e') {
                sortedCodes.eCodes.push( element );
            } else if (firstChar === 'd') {
                if (secChar === '1' || secChar === '2' || secChar === '3' || secChar === '4') {
                    sortedCodes.aCodes.push( element );
                } else if (secChar === '5' || secChar === '6' || secChar === '7' || secChar === '8' || secChar === '9') { 
                    sortedCodes.pCodes.push( element );
                }
            }
            
        });   
                            
        return sortedCodes;
        
    }
    
    bpsmBodyText = ( codeArray, css = 'sw-bpsm-entry' ) => { return !_.isEmpty(codeArray) ? this.codeListStr( codeArray, css) : 'Keine Auswahl getroffen.'; }
    
    
    
    render() {
        return (
                <div id="sw_bpsm_container" className={ this.props.className }>
                    <Alert className="d-block d-md-none mb-4" variant="warning"><strong>Hinweis:</strong> Ihr Browserfenster ist zu schmal, um das BPSM korrekt darzustellen. Daher erfolgt die Darstellung als Liste. Wenn Sie ein Smartphone verwenden, versuchen sie es im Querformat (768px min.).</Alert>
                    <div className="d-block d-md-flex justify-content-center align-items-stretch">
                        { this.bpsmCard( 'Gesundheitsproblem', this.bpsmBodyText( this.props.selectedCodes.icd ), 'darker-info text-white', 'mb-4' ) }
                    </div>
                    { this.bpsmArrowSetUpper() }
                    <div className="d-block d-md-flex justify-content-evenly align-items-stretch">
                        { this.bpsmCard( 'Körperfunktionen und -strukturen', this.bpsmBodyText( this.splitICFCodes( this.props.selectedCodes.icf ).bsCodes ), 'bg-dark text-white',  'mb-4 mb-md-0' ) }
                        { this.bpsmArrowStraight() }
                        { this.bpsmCard( 'Aktivitäten', this.bpsmBodyText( this.splitICFCodes( this.props.selectedCodes.icf ).aCodes ), 'bg-dark text-white', 'mb-4 mb-md-0' ) }
                        { this.bpsmArrowStraight() }
                        { this.bpsmCard( 'Partizipation (Teilhabe)', this.bpsmBodyText( this.splitICFCodes( this.props.selectedCodes.icf ).pCodes ), 'bg-dark text-white' ) }
                    </div>     
                    { this.bpsmArrowSetLower() }
                    { this.bpsmArrowSetLowest() }
                    <div className="d-block d-md-flex justify-content-center align-items-stretch">
                        { this.bpsmCard( 'Umweltfaktoren', this.bpsmBodyText( this.splitICFCodes( this.props.selectedCodes.icf ).eCodes ), 'dark-info text-white', 'mt-4' ) }
                        { this.bpsmArrowStraight( 'my-4' ) }
                        { this.bpsmCard( 'personenbezogene Faktoren', <BPSMPersonalFactors handler={ this.props.handler } />, 'dark-info text-white', 'mt-4', 'false' ) }
                    </div>    
                    <div className="my-4 text-secondary text-center">
                    Für die Zuordnung von Aktivität und Teilhabe wird hier der Ansatz eines getrennten Satzes von Aktivität und Partizipation verwendet, an <a className="link-info" target="_blank" rel="noopener noreferrer" href="https://www.dimdi.de/static/de/klassifikationen/icf/icfhtml2005/zusatz-07-anh-3-liste-teilhabe.htm">Anhang 3 der ICF angelehnt</a>.
                    </div>
                </div>         
               );
    }    
};
export default SWBPSModel;
