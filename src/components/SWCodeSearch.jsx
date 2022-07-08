/**
 * SWCodeSearch React Component: Main Search form for ICD/ICF Codes
 */
//external ressources
import React from 'react';

//react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

//internal
import StatusBadge from '../components/StatusBadge';
import ManParse from '../lib/ManParse';

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
                        codetitle: ''
                     };
        this.handleCodeInput = this.handleCodeInput.bind(this);
        this.matchICDBooks = this.matchICDBooks.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        //declare icd/icf parser for use
        this.parser = new ManParse(manualsWHO);
    }
    
    matchICDBooks(string) {
        //check regex patterns
        const regexPat = { icd: /^[A-TV-Z]{1}[0-9]{2}\.?[0-9]{0,2}[GVAZRLB]{0,2}$/gmi,
                           icf: /^[bsde]{1}[1-9]{0,1}[0-9]{0,4}$/gmi };
        if( string.length > 3 && !string.includes('.') ) { 
            this.setState({icd10: false}); 
        } else {
            regexPat.icd.test(string) ? this.setState({icd10: true}) : this.setState({icd10: false}); 
        } 
        if( string.length !== 3 ){
            regexPat.icf.test(string) ? this.setState({icf: true}, () => {
                string.length === 1 && this.setState({ msg: 'ICF-Kapitel' });
                string.length === 2 && this.setState({ msg: 'ICF-Komponente' });
                string.length > 3 && this.setState({ msg: 'ICF-Code' });
                this.setState({ codetitle: this.parser.icfTitle(string) });    
            }) : this.setState({icf: false, msg: '', codetitle: ''}); 
        } else {
            this.setState({ icf: false, msg: '', codetitle: '' });
        }
    }
    
    handleCodeInput(event) {
        //if we have a valid code, unlock the button for submission
        this.setState({code: event.target.value}, () => {
            this.matchICDBooks(event.target.value);
        });
    }
    //supports API for querying and API or LOCAL for using local data files (xml/json)
    handleSubmitCode(process = 'API') {
        if (process === 'API') {
            const queryString = '?Code=' + this.state.code + '&icd10=' + this.state.icd10 + '&icf=' + this.state.icf;
        } else if (process === 'LOCAL') {
            //process full code information
            if (this.state.icf) {
                console.log('It is a ICF Code!');
            }
            console.log('We do it Local:  ', manualsWHO.icf);
        }
        
    }
    
    render() {
        return (
            <div>
                <InputGroup className="my-3">
                    <Form.Control
                      placeholder="ICD-10 oder ICF Code"
                      aria-label="ICD-10 oder ICF Code"
                      aria-describedby="sw_icd_icf_input"
                      maxLength="7"
                      value={ this.state.code }
                      onChange={ (event) => { this.handleCodeInput(event); } }
                    />
                    <Button 
                        variant="primary" 
                        id="sw_icd_icf_button" 
                        className={ this.state.icd10 || this.state.icf ? '' : 'disabled' }
                        onClick={ () => { this.handleSubmitCode('LOCAL'); } }>
                      { this.props.buttonText === undefined ? 'Go!' : this.props.buttonText }
                    </Button>
                </InputGroup> 
                { this.state.icd10 && <StatusBadge BadgeData="ICD-10"/> }
                { this.state.icf && <StatusBadge BadgeData="ICF"/> }
                { this.state.msg && <StatusBadge BadgeData={ "dark:" + this.state.msg }/> }
                { this.state.codetitle && <StatusBadge BadgeData={ "info:" + this.state.codetitle }/> }
            </div>
               );
    }    
};

export default SWCodeSearch;

