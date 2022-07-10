/* 
 * SWCSElement - Code Search Element -> Here the found Element (ICF/ICD10) will be displayed
 */
//external ressources
import React from 'react';
import { Link } from "react-router-dom";
import _ from "lodash";

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

//internal ressources

class SWCSElement extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleRefElementClick = this.handleRefElementClick.bind(this);
        this.state = { pupdate: false };
    }   
    handleRefElementClick() {
        this.setState({ pupdate: true }, () => {
            console.log('state set! Page udpate is ' + this.state.pupdate);
            //this.props.handler;
        });
    }
    render() {
        return (
                <React.Fragment>
                    { this.props.data.cerrstr !== 'VOID' &&
                        <div className="row me-2">                     
                            <div className={ "col-3 " + (!this.props.data.cerror ? 'bg-dark' : 'bg-warning') + " text-light p-2 d-flex" }>
                                <div>
                                    <h2>{ !this.props.data.cerror ? this.props.data.cname : 'Fehler' }</h2>
                                </div>
                                <div>
                                    { !this.props.data.cerror ? this.props.data.ckind : '???' }
                                </div>
                            </div> 
                            <div className="col-9 p-2">
                                <h2>{ !this.props.data.cerror ? this.props.data.ctitle : 'Leider nichts gefunden!' }</h2>
                                { this.props.data.cerror && 
                                        <React.Fragment>
                                            <p>
                                                { this.props.data.cerror }
                                            </p>
                                            <p>
                                                <span className="text-info"><b>Was ist passiert: </b></span><br />
                                                <span className="text-secondary">
                                                    Wahrscheinlich haben Sie sich vertippt. Prüfen Sie bitte Ihre Eingabe.<br /> 
                                                    Nicht vertippt? Bitte schicken Sie dann einen Hinweis mit dem Fehler an den Admin hier. Wir prüfen das gern.
                                                </span>        
                                            </p>
                                        </React.Fragment>
                                }
                                { this.props.data.cdef && 
                                        this.props.data.cdef.map((element, index) => ( <p key={ index }>{ element.Label['#text'] }</p> ))
                                }
                                { this.props.data.chint && <p>{ this.props.data.chint }</p> }
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
                                        <span className="text-secondary">
                                            <Link to={ '/toolbox/' + this.props.data.csuper + '?icf=true' }
                                                  className="sw-code-button btn btn-outline-secondary btn-sm" 
                                                  onClick={ this.props.handler }
                                                  role="button">{ this.props.data.csuper }</Link>
                                            { ' ' + this.props.data.csuptxt }
                                        </span>
                                    </p>
                                }        
                                { this.props.data.csub && !_.isEmpty(this.props.data.csub) &&
                                    <p>
                                        <span className="text-info"><b>Nachgeordnet: </b></span><br />
                                        {this.props.data.csub.map((element, index, array) => ( 
                                                <span className="text-secondary" key={index}>
                                                    <Link   to={ '/toolbox/' + element.code + '?icf=true' }
                                                            className="sw-code-button btn btn-outline-secondary btn-sm" 
                                                            onClick={ this.props.handler }
                                                            role="button" key={element.code} >{ element.code }</Link>
                                                    { ' ' + element.title + (index === array.length - 1 ? '' : ', ') }
                                                </span>
                                                ))} 
                                    </p>
                                }                              
                            </div> 
                        </div>
                    }
                </React.Fragment>        
                );
    }
};

export default SWCSElement;
