/**
 * Load wait element for Suspended Elements.
 * Basically a wrapper around react-bootstrap's spinner element
 */
//external ressources
import React from 'react';
import _ from "lodash";

import Spinner from 'react-bootstrap/Spinner';

class LoadWait extends React.Component {   
    render() {
        return (
                    <div className="d-flex justify-content-center">
                        <Spinner animation={ _.isEmpty( this.props.animation ) ? "border" : this.props.animation } variant={ _.isEmpty( this.props.variant ) ? "dark" : this.props.variant } className="me-2" role="status">
                            <span className="visually-hidden">{ _.isEmpty( this.props.accessibilityMSG)  ? 'Loading...' : this.props.accessibilityMSG }</span>
                        </Spinner> 
                        <div className="text-dark pt-1"><strong>{ _.isEmpty( this.props.LoadingMSG ) ? 'Lade - Bitte warten...' : this.props.LoadingMSG }</strong></div>
                    </div>
                );
    }
};

export default LoadWait;

