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

class BookChapDDown extends React.Component {
    
    constructor(props) {
        super(props); 
        this.state = { show: false };
        this.opencloseHandle = this.opencloseHandle.bind(this);
    } 
    opencloseHandle = () => this.state.show === true ? this.setState({ show: false }) : this.state.show === false ? this.setState({ show: true }) : null;
    
    render() {

        return (
                <React.Fragment>
                <OverlayTrigger
                    placement='top'
                    overlay={
                    <Tooltip id={ this.props.id + '_tooltip' }>
                        { this.props.tooltipText ? this.props.tooltipText: 'Kapitelauswahl' }
                        </Tooltip>
                        }
                    >   
                    <Button className="pb-0 pe-2 border-top border-bottom" variant="white" onClick={ () => this.opencloseHandle() }>
                      <span className="icon-secondary icon-btn">{ Icons.book }</span>
                    </Button>
                </OverlayTrigger>
                <Offcanvas placement="end" show={ this.state.show } onHide={ () => this.setState({show: false}) }>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Kapitelauswahl</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        Some text as placeholder. In real life you can have the elements you
                        have chosen. Like, text, images, lists, etc.
                    </Offcanvas.Body>
                </Offcanvas>
                </React.Fragment>
                );
    }
};

export default BookChapDDown;
