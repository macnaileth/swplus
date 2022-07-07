/**
 * SWCodeSearch React Component: Main Search form for ICD/ICF Codes
 */
//external ressources
import React from 'react';

//react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import StatusBadge from '../components/StatusBadge.jsx';

//custom react classes
export class SWCodeSearch extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {code: '', msg: '', submit: 'disabled', icd10: false, icf: false};
        this.handleCodeInput = this.handleCodeInput.bind(this);
        this.matchICDBooks = this.matchICDBooks.bind(this);
    }
    
    matchICDBooks(string) {
        //check regex patterns
        const regexPat = { icd: /^[A-TV-Z]{1}[0-9]{2}\.?[0-9]{0,2}[GVAZRLB]{0,2}$/gmi,
                           icf: /^[bsde][1-9][0-9]{0,4}$/gmi };
        regexPat.icd.test(string) ? this.setState({icd10: true}) : this.setState({icd10: false}); 
        regexPat.icf.test(string) ? this.setState({icf: true}) : this.setState({icf: false}); 
    }
    
    handleCodeInput(event) {
        //if we have a valid code, unlock the button for submission
        this.setState({code: event.target.value}, () => {
            event.target.value < 3 ? this.setState({msg: 'warning:Code zu kurz', submit: 'disabled'}) : this.setState({msg: '', submit: ''});
            this.matchICDBooks(event.target.value);
            console.log("Current Code: " + this.state.code + ", Code length: " + this.state.code.length);
        });
    }
    
    render() {
        return (
            <div>
                <InputGroup className="my-3">
                    <Form.Control
                      placeholder="ICD10 oder ICF Code"
                      aria-label="ICD10 oder ICF Code"
                      aria-describedby="sw_icd_icf_input"
                      maxLength="7"
                      value={ this.state.code }
                      onChange={ (event) => { this.handleCodeInput(event); } }
                    />
                    <Button 
                        variant="primary" 
                        id="sw_icd_icf_button" 
                        className={ this.state.submit }
                        onClick={ (event) => { console.log('Submitted!'); }}>
                      { this.props.buttonText === undefined ? 'Go!' : this.props.buttonText }
                    </Button>
                </InputGroup> 
                { this.state.msg && <StatusBadge BadgeData={ this.state.msg }/> }
                { this.state.icd10 && <StatusBadge BadgeData="ICD-10(?)"/> }
                { this.state.icf && <StatusBadge BadgeData="ICF(?)"/> }
            </div>
               );
    }    
};

export default SWCodeSearch;

