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
import ICDModifierList from '../components/ICDModifierList';
import CClipButton from '../components/CClipButton';

import Icons from '../lib/Icons';

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
    preferredModifier = (digit = 4) => {
        
        let dbase = {};
        
        if (digit === 4) {
            dbase = this.props.data.cmodifiers.four;
        }
        if (digit === 5) {
            dbase = this.props.data.cmodifiers.five;
        }        
        
        return digit === 4 || digit === 5 ? dbase.sub[parseInt(dbase.hilite)] !== undefined ? _.isArray(dbase.sub[parseInt(dbase.hilite)].Rubric) ? 
                                            dbase.sub[parseInt(dbase.hilite)].Rubric.find(element => element.kind === "preferred").Label['#text'] : 
                                            dbase.sub[parseInt(dbase.hilite)].Rubric.Label['#text'] : '' : '';
    }
    render() {
        return (
                <React.Fragment>
                    { this.props.data.cerrstr !== 'VOID' &&                       
                        <div className="row">                     
                            <div className={ "col-12 col-md-3 " + (!this.props.data.cerror ? 'bg-dark' : 'bg-warning') + " text-light p-2 d-flex justify-content-start justify-content-md-between" }>
                                <div>
                                <h2 className="mb-0 mb-md-1">{ !this.props.data.cerror ? 
                                                                <React.Fragment>
                                                                    <span className="code-text">{ this.props.data.cname }</span>  
                                                                    <span className="ms-1 border-start border-3">
                                                                        <CClipButton id="sw_copy_code" className="icon-white ms-1" masterstring={ this.props.data.cname }/> 
                                                                    </span>
                                                                </React.Fragment>
                                                                : 'Fehler' }</h2>
                                    {!this.props.data.cerror && this.props.data.ckind !== 'chapter' && this.props.data.ctype === 'icd-10' ?
                                        <React.Fragment>
                                            { !_.isEmpty(this.props.data.cspecChar) ? 
                                                    <React.Fragment>                                         
                                                        <span className="sw-h2-code-four text-white text-uppercase small fw-bold">{ this.props.data.cspecChar.text }</span> 
                                                        <br />
                                                        { this.props.data.cmodifiers.four ? !_.isEmpty(this.props.data.cmodifiers.four.hilite) ? <span className="d-none d-md-inline"><hr /></span> : '' : '' }                                                
                                                    </React.Fragment>
                                            : ''}
                                            { this.props.data.cmodifiers.four ? !_.isEmpty(this.props.data.cmodifiers.four.hilite) ? <span className="d-none d-md-inline sw-h2-code-four text-white text-uppercase small">{ this.preferredModifier(4) }</span> : '' : ''}
                                            { this.props.data.cmodifiers.five ? !_.isEmpty(this.props.data.cmodifiers.five.hilite) ? 
                                                    <span className="d-none d-md-inline">
                                                        <br />
                                                        <hr />
                                                        <span className="sw-h2-code-five text-white text-uppercase small">{ this.preferredModifier(5) }</span> 
                                                    </span>
                                            : '' : ''} 
                                        </React.Fragment>
                                    : ''}
                                </div>
                                <div className="d-none d-lg-block">
                                { !this.props.data.cerror ? <span><Badge pill bg="light" text="dark">{ this.props.data.ctype.toUpperCase() }<span className="d-none d-md-inline">{ ' | ' + this.props.data.ckind } </span></Badge></span> : '???' }
                                </div>
                            </div> 
                            <div className="col-12 col-md-9 p-2">
                            <h2>{ !this.props.data.cerror ? 
                                    <React.Fragment>
                                        <span className="sw-h2-code">{ this.props.data.ctitle }</span> 
                                        <span className="icon icon-add icon-black ms-1">{ Icons.addlist }</span> 
                                    </React.Fragment>
                                    : 'Leider nichts gefunden!' }</h2>                          
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
                                { this.props.data.cdef && this.props.data.ctype === 'icf' ?
                                        this.props.data.cdef.map((element, index) => ( <p key={ index }>{ element.Label['#text'] }</p> )) : 
                                        this.props.data.cdef && this.props.data.ctype === 'icd-10' ? <p>{ this.props.data.cdef }</p> : ''
                                }
                                { this.props.data.chint && <p>{ this.props.data.chint }</p> }
                                { !_.isEmpty(this.props.data.cmodifiers) && this.props.data.ctype === 'icd-10' ? 
                                    <React.Fragment>
                                        { !_.isEmpty(this.props.data.cmodifiers.four) &&
                                            <div className="sw-digit-code-list mb-3">
                                                <span className="text-info"><b>Kodierung vierte Stelle: </b></span><br />
                                                <span className="text-secondary mb-3">{ _.isArray(this.props.data.cmodifiers.four.label) ? 
                                                                                        <ul className="list-unstyled">{ this.props.data.cmodifiers.four.label.map((element, index) => ( <li key={ index }>{ element }</li> )) }</ul> : 
                                                                                        this.props.data.cmodifiers.four.label }
                                                    <ICDModifierList className="small mt-2" data={ this.props.data.cmodifiers.four.sub } hilite={ this.props.data.cmodifiers.four.hilite ? this.props.data.cmodifiers.four.hilite : '' }/>
                                                </span>
                                            </div> }
                                        { !_.isEmpty(this.props.data.cmodifiers.five) &&  
                                            <div className="sw-digit-code-list mb-3">
                                                <span className="text-info"><b>Kodierung fünfte Stelle: </b></span><br />
                                                <span className="text-secondary">{ _.isArray(this.props.data.cmodifiers.five.label) ? 
                                                                                        <ul className="list-unstyled">{ this.props.data.cmodifiers.five.label.map((element, index) => ( <li key={ index }>{ element }</li> )) }</ul> : 
                                                                                        this.props.data.cmodifiers.five.label }
                                                    <ICDModifierList className="small" data={ this.props.data.cmodifiers.five.sub } hilite={ this.props.data.cmodifiers.five.hilite ? this.props.data.cmodifiers.five.hilite : '' }/>
                                                </span>                                                
                                            </div> }  
                                    </React.Fragment>
                                    : ''
                                }                                
                                { this.props.data.cinc  && this.props.data.ctype === 'icf' ?
                                    <p>
                                        <span className="text-info"><b>Beeinhaltet: </b></span><br />
                                        <span className="text-secondary">{ this.props.data.cinc.Label['#text'] }</span>
                                    </p> : 
                                    !_.isEmpty(this.props.data.cinc) && this.props.data.ctype === 'icd-10' ? 
                                    <p>
                                        <span className="text-info"><b>Beeinhaltet: </b></span><br />
                                        <span className="text-secondary">{ 
                                            this.props.data.cinc.map((element, index, array) => ( <span key={ index }>{ element.valueString + (index === array.length - 1 ? '' : ', ') 
                                        }</span> )) }</span>
                                    </p> : ''
                                }
                                { this.props.data.cexc  && this.props.data.ctype === 'icf' ?
                                    <p>
                                        <span className="text-info"><b>Exklusive: </b></span><br />
                                        <span className="text-secondary">{ this.props.data.cexc.Label['#text'] }</span>
                                    </p> :
                                    !_.isEmpty(this.props.data.cexc) && this.props.data.ctype === 'icd-10' ? 
                                    <p>
                                        <span className="text-info"><b>Exklusive: </b></span><br />
                                        <span className="text-secondary">{ 
                                            this.props.data.cexc.map((element, index, array) => ( <span key={ index }>{ element.valueString + (index === array.length - 1 ? '' : ', ') 
                                        }</span> )) }</span>
                                    </p> : ''
                                }  
                                { this.props.data.csuper &&
                                    <p>
                                        <span className="text-info"><b>Übergeordnet: </b></span><br />
                                        <span className="text-secondary">
                                            <Link to={ '/toolbox/' + this.props.data.csuper + (this.props.data.ctype === 'icf' ? '?icf=true' : this.props.data.ctype === 'icd-10' ? '?icd=true' : '') }
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
                                                    <Link   to={ '/toolbox/' + element.code + (this.props.data.ctype === 'icf' ? '?icf=true' : this.props.data.ctype === 'icd-10' ? '?icd=true' : '') }
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
