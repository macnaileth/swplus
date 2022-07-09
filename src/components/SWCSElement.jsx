/* 
 * SWCSElement - Code Search Element -> Here the found Element (ICF/ICD10) will be displayed
 */
//external ressources
import React from 'react';
import { Link } from "react-router-dom";

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

//internal ressources

class SWCSElement extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleRefElementClick = this.handleRefElementClick.bind(this);
    }   
    componentDidUpdate() {
        console.log(this.props.data);
    }
    handleRefElementClick(string) {
        console.log('ButtonVal: ' + string + ', URL Param: ');
    }
    render() {
        return (
                <React.Fragment>
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
                                    <Link reloadDocument to={ '/toolbox/' + this.props.data.csuper + '?icf=true' }
                                          className="sw-code-button btn btn-outline-secondary btn-sm" 
                                          role="button">{ this.props.data.csuper }</Link>
                                </p>
                            }        
                            { this.props.data.csub &&
                                <p>
                                    <span className="text-info"><b>Nachgeordnet: </b></span><br />
                                    {this.props.data.csub.map(element => ( 
                                            <Link   reloadDocument to={ '/toolbox/' + element.code + '?icf=true' }
                                                    className="sw-code-button btn btn-outline-secondary btn-sm" 
                                                    role="button" key={element.code} >{ element.code }</Link>
                                            ))} 
                                </p>
                            }                              
                        </div> 
                    </div>
                </React.Fragment>        
                );
    }
};

export default SWCSElement;
