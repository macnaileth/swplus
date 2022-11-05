/**
 * Popover Icon Component
 */
//external ressources
import React from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

class IconPopover extends React.Component {
    
    render() {            
            return (
                    <React.Fragment>
                          <OverlayTrigger
                            key={ this.props.placement === '' ? 'top' : this.props.placement }
                            placement={ this.props.placement === '' ? 'top' : this.props.placement }
                            overlay={
                              <Popover id={ this.props.id === '' ? 'no_id_provided' : this.props.id }>
                                <Popover.Header as="h3">{ this.props.headerText }</Popover.Header>
                                <Popover.Body>
                                  { this.props.bodyText }
                                </Popover.Body>
                              </Popover>
                            }
                          >
                          <span className={ this.props.className }>{ this.props.icon }</span>
                          </OverlayTrigger>
                    </React.Fragment>
                   );               
    }
};

export default IconPopover;
