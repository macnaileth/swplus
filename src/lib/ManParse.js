/* 
 * Parser Class for ClaML manuals converted to JSON.
 */

//third party
import _ from "lodash";

class ManParse {
    constructor(manual) {
        this.manual = manual;
    }
    codeRubric = (data, string) => { 
            return data && Array.isArray(data.Rubric) ? 
                                    data.Rubric.find(element => element.kind === string) : 
                                    data.Rubric ? data.Rubric : '';           
    };
    codeMultiRubric = (data, string) => { 
        return _.filter(data.Rubric, function(item) {
                return _.includes(item.kind, string);
        });       
    }; 
    //for FHIR ICD-10 Code Property retrieval like include, exclude or parent
    codeMultiProp = (data, string) => { 
        return _.filter(data, function(item) {
                return _.includes(item.code, string);
        });   
    };    
    strRemoveCtrlChars = (string) => {
        return string.replace(/[\n\t\r]/g,"");
    }
    parseicfCode = (string) => {
        //find Code in Manual
        const Code = this.manual.icf.Class.find(element => element.code === string);
        return Code ? Code : undefined;
    };
    parseicdCode = (string) => {
        const Code = this.manual.icd.find(element => element.code === string.toUpperCase());
        return Code ? Code : undefined;
    }
    geticfSubCodes = (array) => {
                const SubCodes = [];
                array.map( (element, index) => {  
                            SubCodes[index] = {code: element.code, title: this.icfTitle(element.code, 300)};
                        });
                return SubCodes;
            };   
    geticdSubCodes = (array) => {
                const SubCodes = [];
                array.map( (element, index) => {  
                            SubCodes[index] = {code: element, title: this.icdTitle(element, 300)};
                        });
                return SubCodes;
            };             
    icfTitle = (string, charLimit = 40, elipsis = '...') => {       
        const pData  = this.parseicfCode(string) ? this.parseicfCode(string) : '';
        const pRubric = this.codeRubric(pData, 'preferred');
        const pTitle = pRubric ? pRubric.Label['#text'] : '';
        //return title
        return pTitle ? pTitle.length > charLimit ? 
                        pTitle.substring(0, charLimit) + elipsis : pTitle : '';
    }
    icdTitle = (string, charLimit = 40, elipsis = '...') => {
        const pData = this.parseicdCode(string) ? this.parseicdCode(string) : '';
        return pData ? pData.display.length > charLimit ?
                pData.display.substring(0, charLimit) + elipsis : 
                pData.display : '';
    }
    icdModDigits = (string) => {
        const digits = {};
        string.includes('4.') !== undefined ? digits.four = true : digits.four = false;
        string.includes('5.') !== undefined ? digits.five = true : digits.five = false;
        return digits;
    }
    icdModifiers = (string) => {
        const Modifiers = this.manual.icdMod.find( element => element.code.includes(string));
        const ModElement = {};
        //build modifier element
        ModElement.label = Modifiers.Rubric.Label.Para; //Label text
        ModElement.kind = Modifiers.Rubric.kind;
        ModElement.code = Modifiers.code;
        //TODO: resolve subcodes of modifiers
        ModElement.sub = Modifiers.SubClass;
        
        return ModElement;
    }
    //stringMod = modLink string, stringSuper = Super Class block, for ex. E10-E14, stringCode = ICD-10 Code 
    icdModGroup = (stringMod, stringSuper, stringCode) => {
        const digits = this.icdModDigits(stringMod);
        const superFirst = stringSuper.substr(0,3);
        const modifierElement = {};
        
        if ( digits.four === true ){
            //string for modifier retrieval
            const needle = this.icdModifiers( superFirst + '_4' );
            console.log('Digits to check (' + superFirst + '_4'+ '): Four:' + digits.four + ', Result:', needle);
        }
        if ( digits.five === true ){
            const needle = this.icdModifiers( superFirst + '_5' );
            console.log('Digits to check (' + superFirst + '): Five:' + digits.five + ', Result:', needle);
        }
    
    }
    icdElement(string) {
        const Element = {};
        const cData = string && this.parseicdCode(string) ? this.parseicdCode(string) : '';
        
        if(cData) {
            Element.ctype = 'icd-10';
            Element.cname = cData.code;
            Element.ctitle = cData.display;
            Element.cdef = cData.definition;
            Element.ckind = _.find(cData.property, ['code', 'kind']).valueCode;
            
            if(cData.property.find(element => element.code === 'parent')) {
                Element.csuper = _.find(cData.property, ['code', 'parent']).valueCode;
                Element.csuptxt = this.icdTitle(Element.csuper, 300);
            }
            //Handle children
            Element.csub = [];
            if(cData.property.find(element => element.code === 'child')) {
                const childArray = this.codeMultiProp(cData.property, 'child');
                childArray.csub = [];
                childArray.map(element => childArray.csub.push(element.valueCode));
                Element.csub = this.geticdSubCodes(childArray.csub);
            }           
            Element.cinc = this.codeMultiProp(cData.property, 'inclusion');
            Element.cexc = this.codeMultiProp(cData.property, 'exclusion');
            Element.chint = cData.property.find(element => element.code === 'coding-hint') ? _.find(cData.property, ['code', 'coding-hint']).valueString : '';
            Element.cmodLink = cData.property.find(element => element.code === 'modifierlink') ? _.find(cData.property, ['code', 'modifierlink']).valueString : '';
            //handle 4. 5. digit e.g. .xx of the code if needed
            if(Element.cmodLink) {
                //we have a modifier link, so we have to get the digit where we should put the modifier to
                const digits = this.icdModGroup(Element.cmodLink, Element.csuper, Element.cname);                
            }
            
        } else {
            Element.cerrstr = string === undefined ? 'VOID' : '';
            Element.cerror = string ? string + ' ist kein gültiges Element der ICD-10.' : 'Kein Element gefunden.';
        }
        
        console.log('ICD-10 Data: ', cData);
        console.log('ICD-10 Element: ', Element);
        return Element;
    }
    icfElement(string) {
        const Element = {};
        const eData  = string && this.parseicfCode(string) ? this.parseicfCode(string) : '';
        //debug
        //console.log('Code ' + string + ' data:', eData);
        //collect data
        if(eData) {
            Element.ctype = 'icf';
            Element.ctitle = this.codeRubric(eData, 'preferred').Label['#text'];      
            Element.cinc = this.codeRubric(eData, 'inclusion') !== this.codeRubric(eData, 'preferred') ? this.codeRubric(eData, 'inclusion') : '';  
            Element.cexc = this.codeRubric(eData, 'exclusion')  !== this.codeRubric(eData, 'preferred') ? this.codeRubric(eData, 'exclusion') : '';
            Element.cname = eData.code;
            //superclass prevention
            if (string.length > 1) {
                if (eData.SuperClass) {
                    Element.csuper = eData.SuperClass.code;
                    Element.csuptxt = this.icfTitle(eData.SuperClass.code, 300);
                }
                Element.chint = this.codeRubric(eData, 'coding-hint').Label['#text'];
            }
            if (string.length < 2) {
                Element.cdef = this.codeMultiRubric(eData, 'definition');
            }
            Element.csub = [];
            if (eData.SubClass) {
                //Build Buttons
                Element.csub = this.geticfSubCodes(eData.SubClass);
            }
            Element.ckind = eData.kind;
        } else {
            Element.cerrstr = string === undefined ? 'VOID' : '';
            Element.cerror = string + ' ist kein gültiges Element der ICF.';
        }
        return Element;
    }
}
export default ManParse;

