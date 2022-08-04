/**
 * ICD-10/ICF chapter list React Component: Builds a List of chapters based on data entered
 */
//external ressources
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import _ from "lodash";
import {LinkContainer} from 'react-router-bootstrap'

class BookChapList extends React.Component {
    
    constructor(props) {
        super(props);
    }
    render() {
        return ( !_.isEmpty(this.props.data) ? 
                        <div>
                            <ListGroup className={ 'list-group list-group-flush chapter-list' + ( !_.isEmpty(this.props.className) ? ' ' + this.props.className : '' ) }>
                                { Object.entries(this.props.data).map((element, index) => (
                                                    <LinkContainer to={ '/toolbox/' + element[0].toLowerCase() + '?' + this.props.manualtype + '=true'} key={ index } onClick={ this.props.handler }>
                                                        <ListGroup.Item action href={ '/toolbox/' + element[0].toLowerCase() + '?' + this.props.manualtype + '=true'} className={ 'list-group-item chapter-list-item item-' + index }>
                                                            <div className="row">
                                                                <div className="fw-bold text-info col chapcode">{ element[0] }</div>                                                                
                                                                <div className="ms-2 col-9 chaptext">{ element[1] }</div> 
                                                            </div>
                                                        </ListGroup.Item>
                                                    </LinkContainer>
                                                )) }
                            </ListGroup>
                        </div> : console.log( 'BookChapList: No data retrieved - no list rendered' )
                );
    }
};

export default BookChapList;