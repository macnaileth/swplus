/**
 * ICD-10/ICF chapter list React Component: Builds a List of chapters based on data entered
 */
//external ressources
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import _ from "lodash";

class BookChapList extends React.Component {
    
    constructor(props) {
        super(props);
    }
    render() {
        return ( !_.isEmpty(this.props.data) ? 
                        <div>
                            <ListGroup className={ 'list-group list-group-flush' + ( !_.isEmpty(this.props.className) ? ' ' + this.props.className : '' ) }>
                                { Object.entries(this.props.data).map((element, index) => (
                                                        <ListGroup.Item action href="#" className={ 'list-group-item item-' + index } key={ index }>
                                                            <div className="row">
                                                                <div className="fw-bold text-info col">{ element[0] }</div>                                                                
                                                                <div className="ms-2 col-9">{ element[1] }</div> 
                                                            </div>
                                                        </ListGroup.Item>
                                                )) }
                            </ListGroup>
                        </div> : console.log( 'BookChapList: No data retrieved - no list rendered' )
                );
    }
};

export default BookChapList;