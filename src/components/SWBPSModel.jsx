/**
 * BPSM class to create the bio psycho social model of the icf by using selected icd/icf-codes
 */
import React from 'react';

//third party stuff
import Card from 'react-bootstrap/Card';

export class SWBPSModel extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.bpsmCard = this.bpsmCard.bind(this);
    }
    
    bpsmCard = ( titleStr, bodyContent, cssStr = '' ) => {
        return (
            <Card className="mx-2 my-4 sw-bpsm-card shadow-sm">
                <Card.Header className={ cssStr === '' ? 'sw-bpsm-card-header' : 'sw-bpsm-card-header ' + cssStr }><strong>{ titleStr }</strong></Card.Header>
                <Card.Body>
                    <Card.Text>
                        { bodyContent }
                    </Card.Text>
                </Card.Body>
            </Card>        
            );
    }
    
    render() {
        console.log('codes: ', this.props.selectedCodes);
        return (
                <div id="sw_bpsm_container">
                    <div className="d-flex justify-content-center align-items-stretch">
                        { this.bpsmCard( 'Gesundheitsproblem', 'Lore Ipsum Dolor', 'darker-info text-white' ) }
                    </div>
                    <div className="d-flex justify-content-evenly align-items-stretch">
                        { this.bpsmCard( 'Körperfunktionen und -strukturen', 'Lore Ipsum Dolor', 'bg-dark text-white' ) }
                        { this.bpsmCard( 'Aktivitäten', 'Lore Ipsum Dolor', 'bg-dark text-white' ) }
                        { this.bpsmCard( 'Partizipation (Teilhabe)', 'Lore Ipsum Dolor', 'bg-dark text-white' ) }
                    </div>     
                    <div className="d-flex justify-content-evenly align-items-stretch">
                        { this.bpsmCard( 'Umweltfaktoren', 'Lore Ipsum Dolor', 'dark-info text-white' ) }
                        { this.bpsmCard( 'personenbezogene Faktoren', 'Lore Ipsum Dolor', 'dark-info text-white' ) }
                    </div>                       
                </div>         
               );
    }    
};
export default SWBPSModel;
