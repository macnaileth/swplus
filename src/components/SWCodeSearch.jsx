/**
 * SWCodeSearch React Component: Main Search form for ICD/ICF Codes
 */
//external ressources
import React from 'react';
//react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
//Lodash
import _ from "lodash";
//internal
import StatusBadge from '../components/StatusBadge';
import ManParse from '../lib/ManParse';
import SwCSElement from '../components/SWCSElement';

//json manuals
import manualsWHO from '../lib/manuals';
Object.freeze(manualsWHO);

//custom react classes
export class SWCodeSearch extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {  code: '', 
                        msg: '',  
                        icd10: false, 
                        icf: false,
                        codetitle: '',
                        codeobj: {},
                        cupdate: false
                     };
        this.handleCodeInput = this.handleCodeInput.bind(this);
        this.matchICDBooks = this.matchICDBooks.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        this.matchQURI = this.matchQURI.bind(this);
        this.didURLchange = this.didURLchange.bind(this);
        this.ChildUpdateHandler = this.ChildUpdateHandler.bind(this);
        //declare icd/icf parser for use
        this.parser = new ManParse(manualsWHO);
        //get URL path
        this.pathURL = window.location.pathname;
        //get query string
        this.queryStr = new URLSearchParams(document.location.search);
        
    }
    ChildUpdateHandler = () => {
        this.setState({
           cupdate: true
         }, () => {
                if (!this.queryStr.get("icf")) {
                    //update query string
                    this.queryStr = new URLSearchParams(document.location.search);
                }
                console.log('Updated from Child - state: ' + this.state.cupdate + ', query str: ' + this.queryStr.get("icf"));
            });     
    }
    matchQURI(basepath = 'toolbox') {
        //match routes and set codes accordingly
        //get uri segments
        const segArray = this.pathURL.substring(1).split("/");
        
        if ( segArray[0] === basepath ) {
            //is it icf?
            if ( this.queryStr.get("icf") === "true" ) {
                //set for icf
                this.setState({ codeobj: this.parser.icfElement(segArray[1]), 
                                icf: true,
                                codetitle: this.parser.icfTitle(segArray[1]),
                                msg: this.icfElemType(segArray[1])});
            }
        } 
        console.log('URL path: ' + this.pathURL, ' Query String: ', this.queryStr.get("icf"));
        console.log('URL segments: ', segArray);
    }   
    matchICDBooks(string) {
        //check regex patterns
        const regexPat = { icd: /^[A-TV-Z]{1}[0-9]{2}\.?[0-9]{0,2}[GVAZRLB]{0,2}$/gmi,
                           icf: /^[bsde]{1}[1-9]{0,1}[0-9]{0,4}$/gmi };
        if (string) {               
            if( string.length > 3 && !string.includes('.') ) { 
                this.setState({icd10: false}); 
            } else {
                regexPat.icd.test(string) ? this.setState({icd10: true}) : this.setState({icd10: false}); 
            } 
            if( string.length !== 3 ){
                regexPat.icf.test(string) ? this.setState({icf: true}, () => {
                    this.setState({ msg: this.icfElemType(string) });
                    this.setState({ codetitle: this.parser.icfTitle(string) });    
                }) : this.setState({icf: false, msg: '', codetitle: ''}); 
            } else {
                this.setState({ icf: false, msg: '', codetitle: '' });
            }
        }
    }
    icfElemType = (string) => {
        return string && string.length === 1 ? 'ICF-Komponente' : 
               string && string.length === 2 ? 'ICF-Kapitel' : 
               string && string.length > 3 ? 'ICF-Code' : '';
    }
    handleCodeInput(event) {
        //if we have a valid code, unlock the button for submission
        this.setState({code: event.target.value.toLowerCase()}, () => {
            this.matchICDBooks(event.target.value.toLowerCase());
        });
    }
    //supports API for querying and API or LOCAL for using local data files (xml/json)
    async handleSubmitCode(process = 'API', event) {   
        event.preventDefault();
        
        if (process === 'API') {
            const queryString = '?Code=' + this.state.code + '&icd10=' + this.state.icd10 + '&icf=' + this.state.icf;
        } else if (process === 'LOCAL') {
            //process full code information
            if (this.state.icf) {
                await this.setState({ codeobj: this.parser.icfElement(this.state.code) }); 
                await window.history.replaceState(null, "New Page Title", '/toolbox/' + this.state.code + '?icf=true' );
                //update query string
                this.queryStr = new URLSearchParams(document.location.search);
            } else {
                this.setState({ codeobj: {} });
            }
        }
        
    }
    didURLchange = () => {
        const curURLpath = window.location.pathname;
        if (curURLpath === this.pathURL) {
            return false;
        } else {
            this.pathURL = window.location.pathname;
            return true;
        }
    }
    componentDidUpdate() {
        this.didURLchange() === true && this.matchQURI();
        //console.log('URL changed: '+URIChange);
        //this.matchQURI();
    }    
    componentDidMount() {
        this.matchQURI();
    }
    render() {
        return (
                <React.Fragment>
                    <Form>
                        <div className="row justify-content-center mt-3"> 
                            <div className="col-12 col-md-9">
                                <InputGroup className="shadow-sm">                  
                                    <Form.Control        
                                        id="sw-codesearch"
                                        placeholder="ICD-10 oder ICF Code"
                                        aria-label="ICD-10 oder ICF Code"
                                        aria-describedby="sw_icd_icf_input"
                                        maxLength="7"
                                        value={ this.state.code }
                                        onChange={ (event) => { this.handleCodeInput(event); } }
                                    />
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        id="sw_icd_icf_button" 
                                        className={ this.state.icd10 || this.state.icf ? '' : 'disabled' }
                                        onClick={ (event) => { this.handleSubmitCode('LOCAL', event); } }>
                                        { this.props.buttonText === undefined ? 'Go!' : this.props.buttonText }
                                    </Button>
                                </InputGroup> 
                                <div className="sw-hanging-info text-center">
                                    { this.state.icd10 && <StatusBadge BadgeData="ICD-10"/> }
                                    { this.state.icf && <StatusBadge BadgeData="ICF"/> }
                                    { this.state.msg && <StatusBadge BadgeData={ "dark:" + this.state.msg }/> }
                                    <span className="d-none d-md-inline ms-2">
                                        { this.state.codetitle && <StatusBadge BadgeData={ "info:" + this.state.codetitle }/> }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Form>
                    <div className="row">
                        <div className="col mt-5">
                            { !_.isEmpty( this.state.codeobj ) && <SwCSElement handler = {this.ChildUpdateHandler} data = { this.state.codeobj } /> }
                        </div>
                    </div>                
                </React.Fragment>
               );
    }    
};

export default SWCodeSearch;

