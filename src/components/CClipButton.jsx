/**
 * Copy-to-Clipboard button React component: Creates a button icon to copy text to the clipboard
 */
//external ressources
import React from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

//internal ressources
import Icons from '../lib/Icons';

class CClipButton extends React.Component {
    
    constructor(props) {
        super(props);
        this.performCopy = this.performCopy.bind(this);        
    }
    performCopy = ( string, logging = true ) => {
       
        navigator.clipboard.writeText(string).then(function() {
            /* clipboard successfully set */
            logging === true && console.log('Copied: ' + string);
        }, function() {
            /* clipboard write failed */
            logging === true && console.log('Copy to clipboard failed!');
        });
 
    }
        render() {            
            return (
                    <React.Fragment>
                        <OverlayTrigger
                          placement='top'
                          overlay={
                            <Tooltip id={ this.props.id + '_tooltip' }>
                                { this.props.tooltipText ? this.props.tooltipText : 'In Zwischenablage kopieren' }
                            </Tooltip>
                          }
                        >            
                            <span 
                                id={ this.props.id }
                                className={ 'icon icon-copy' + ( this.props.className ? ' ' + this.props.className : '' ) }
                                onClick={ () => this.performCopy( this.props.masterstring ? this.props.masterstring : '', 
                                                                  this.props.logging === true || this.props.logging === false ? 
                                                                  this.props.logging : true ) }
                                >
                                { Icons.copy }
                            </span> 
                        </OverlayTrigger>
                    </React.Fragment>
                   );               
            }
};

export default CClipButton;
