/**
 * StatusBadge React Component: Builds a Badge based on data entered
 */
//external ressources
import React from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

//internal ressources
import Icons from '../lib/Icons';
import BookChapList from './BookChapList';

class BookChapDDown extends React.Component {
    
    constructor(props) {
        super(props); 
        this.state = { show: false };
        this.opencloseHandle = this.opencloseHandle.bind(this);
        this.chapters = { icf: this.props.chapters[0], icd: this.props.chapters[1] };
    } 
    opencloseHandle = () => this.state.show === true ? this.setState({ show: false }) : this.state.show === false ? this.setState({ show: true }) : null;
    
    render() {

        return (
                <React.Fragment>
                    { console.log('Chapters: ', this.chapters.icf) }
                    <OverlayTrigger
                        placement='top'
                        overlay={
                        <Tooltip id={ this.props.id + '_tooltip' }>
                            { this.props.tooltipText ? this.props.tooltipText: 'Kapitel-/Komponentenauswahl' }
                            </Tooltip>
                            }
                        >   
                        <Button className="pb-0 pe-2 border-top border-bottom" variant="white" onClick={ () => this.opencloseHandle() }>
                          <span className="icon-secondary icon-btn">{ Icons.book }</span>
                        </Button>
                    </OverlayTrigger>
                    <Offcanvas placement="end" show={ this.state.show } onHide={ () => this.setState({show: false}) }>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Kapitel-/Komponentenauswahl</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>  
                            <h3>ICD-10 Kapitel</h3>
                            <p className="lead">
                            Auswahl aus den insgesamt 22 Kapiteln des ICD-10 Manuals.
                            </p>
                            <BookChapList className="mb-5 border-bottom"data={ this.chapters.icd }/>
                            <h3>ICF Komponenten</h3>
                            <p className="lead">
                            Auswahl aus den 4 Komponenten der ICF. Prsönliche Faktoren werden nicht kodiert.
                            </p>                            
                            <BookChapList data={ this.chapters.icf }/>
                        </Offcanvas.Body>
                    </Offcanvas>
                </React.Fragment>
                );
    }
};

export default BookChapDDown;
