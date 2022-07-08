/* 
 * SWCSElement - Code Search Element -> Here the found Element (ICF/ICD10) will be displayed
 */
//external ressources
import React from 'react';

import Badge from 'react-bootstrap/Badge';

class SWCSElement extends React.Component {
    
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        console.log(this.props.data);
    }
    render() {
        return (
                <React.Fragment>
                    <div className="row me-2">
                        <div className="col-3 bg-dark text-light p-2"><h2>{ this.props.data.cname }</h2></div>
                        <div className="col-9 p-2">
                            <h2>{ this.props.data.ctitle }</h2>
                            <p>{ this.props.data.chint }</p>
                            { this.props.data.cinc &&
                                <p>
                                    <span className="text-info"><b>Beeinhaltet: </b></span><br />
                                    <span className="text-secondary">{ this.props.data.cinc.Label['#text'] }</span>
                                </p>
                            }
                            { this.props.data.cexc &&
                                <p>
                                    <span className="text-info"><b>Exklusive: </b></span><br />
                                    <span className="text-secondary">{ this.props.data.cexc.Label['#text'] }</span>
                                </p>
                            }  
                            { this.props.data.csuper &&
                                <p>
                                    <span className="text-info"><b>Übergeordnet: </b></span><br />
                                    <span className="text-secondary">{ this.props.data.csuper }</span>
                                </p>
                            }        
                            { this.props.data.csub &&
                                <p>
                                    <span className="text-info"><b>Nachgeordnet: </b></span><br />
                                    {this.props.data.csub.map(element => ( <Badge pill bg="secondary">{element.code}</Badge> ))} 
                                </p>
                            }                              
                        </div> 
                    </div>
                </React.Fragment>        
                );
    }
};

export default SWCSElement;
