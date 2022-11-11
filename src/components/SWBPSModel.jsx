/**
 * BPSM class to create the bio psycho social model of the icf by using selected icd/icf-codes
 */
import React from 'react';

//third party stuff
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert'

export class SWBPSModel extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.bpsmCard = this.bpsmCard.bind(this);
        this.bpsmArrowStraight = this.bpsmArrowStraight.bind(this);
        this.bpsmArrowSetUpper = this.bpsmArrowSetUpper.bind(this);
        this.bpsmArrowSetLower = this.bpsmArrowSetLower.bind(this);
        this.bpsmArrowSetLowest = this.bpsmArrowSetLowest.bind(this);
    }
    
    bpsmCard = ( titleStr, bodyContent, cssHead = '', cardCSS = '' ) => {
        return (
            <Card className={ cardCSS === '' ? "mx-0 mx-md-2 sw-bpsm-card shadow-sm" : "mx-0 mx-md-2 sw-bpsm-card shadow-sm " + cardCSS } >
                <Card.Header className={ cssHead === '' ? 'sw-bpsm-card-header' : 'sw-bpsm-card-header ' + cssHead }><strong>{ titleStr }</strong></Card.Header>
                <Card.Body>
                    <Card.Text>
                        { bodyContent }
                    </Card.Text>
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
    
    render() {
        console.log('codes: ', this.props.selectedCodes);
        return (
                <div id="sw_bpsm_container" className={ this.props.className }>
                    <Alert className="d-block d-md-none mb-4" variant="warning"><strong>Hinweis:</strong> Ihr Browserfenster ist zu schmal, um das BPSM korrekt darzustellen. Daher erfolgt die Darstellung als Liste. Wenn Sie ein Smartphone verwenden, versuchen sie es im Querformat (768px min.).</Alert>
                    <div className="d-block d-md-flex justify-content-center align-items-stretch">
                        { this.bpsmCard( 'Gesundheitsproblem', 'Lore Ipsum Dolor', 'darker-info text-white', 'mb-4' ) }
                    </div>
                    { this.bpsmArrowSetUpper() }
                    <div className="d-block d-md-flex justify-content-evenly align-items-stretch">
                        { this.bpsmCard( 'Körperfunktionen und -strukturen', 'Lore Ipsum Dolor', 'bg-dark text-white',  'mb-4 mb-md-0' ) }
                        { this.bpsmArrowStraight() }
                        { this.bpsmCard( 'Aktivitäten', 'Lore Ipsum Dolor', 'bg-dark text-white', 'mb-4 mb-md-0' ) }
                        { this.bpsmArrowStraight() }
                        { this.bpsmCard( 'Partizipation (Teilhabe)', 'Lore Ipsum Dolor', 'bg-dark text-white' ) }
                    </div>     
                    { this.bpsmArrowSetLower() }
                    { this.bpsmArrowSetLowest() }
                    <div className="d-block d-md-flex justify-content-center align-items-stretch">
                        { this.bpsmCard( 'Umweltfaktoren', 'Lore Ipsum Dolor', 'dark-info text-white', 'mt-4' ) }
                        { this.bpsmArrowStraight( 'my-4' ) }
                        { this.bpsmCard( 'personenbezogene Faktoren', 'Lore Ipsum Dolor', 'dark-info text-white', 'mt-4' ) }
                    </div>                       
                </div>         
               );
    }    
};
export default SWBPSModel;
