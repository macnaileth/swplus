/**
 * ICD Modifier list React Component: Builds a List of ICD Modifiers based on data entered
 */
//external ressources
import React from 'react';

import _ from "lodash";

class ICDModifierList extends React.Component {
    
    constructor(props) {
        super(props);
    }
    render() {
        return ( !_.isEmpty(this.props.data) ? 
                        <div>
                            <ul className={ 'list-group list-group-flush' + ( this.props.className ? ' ' + this.props.className : '' ) }>
                                { this.props.data.map((element, index) => (
                                                        <li className={ 'list-group-item' + (index === parseInt(this.props.hilite) ? ' dark-info text-white hilite' : '') } key={ index }>
                                                            <span className={ (index === parseInt(this.props.hilite) ? 'bg-white text-dark ' : 'bg-secondary text-white ') + 'p-1 rounded me-2' }>{ element.code }</span>
                                                            { _.isArray(element.Rubric) ? element.Rubric.map(element => element.kind === "preferred" ? element.Label['#text'] : '') :
                                                                    element.Rubric.Label['#text'] ? element.Rubric.Label['#text'] : '' }                                                                                                      
                                                        </li>
                                                )) }
                            </ul>
                        </div> : console.log( 'ICDModifierList: No data retrieved - no list rendered' )
                );
    }
};

export default ICDModifierList;
