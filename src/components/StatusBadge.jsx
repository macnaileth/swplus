/**
 * StatusBadge React Component: Builds a Badge based on data entered
 */
//external ressources
import React from 'react';

import Badge from 'react-bootstrap/Badge';


export class StatusBadge extends React.Component {
    
    constructor(props) {
        super(props);
    }
        render() {
            
            const badgeBG   = this.props.BadgeData.substr(0, this.props.BadgeData.indexOf(':'));
            const badgeMSG  = this.props.BadgeData.substring(this.props.BadgeData.indexOf(':') + 1);
            
            return (<Badge bg={badgeBG ? badgeBG : 'secondary'}>{ badgeMSG }</Badge>);               
            }
};

export default StatusBadge;
