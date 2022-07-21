/**
 * StatusBadge React Component: Builds a Badge based on data entered
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
                                                        <li className="list-group-item" key={ index }>
                                                            <span className="bg-secondary text-white p-1 rounded me-2">{ element.code }</span>
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
