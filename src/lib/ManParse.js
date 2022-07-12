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
    parseicfCode = (string) => {
        //find Code in Manual
        const Code = this.manual.icf.Class.find(element => element.code === string);
        return Code ? Code : undefined;
    };
    parseicdCode = (string) => {
        console.log('String: ' + string);
        const Code = this.manual.icd.find(element => element.code === string.toUpperCase());
        return Code ? Code : undefined;
    }
    geticfSubCodes = (array) => {
                const SubCodes = [];
                array.map( (element, index) => {  
                            SubCodes[index] = {code: element.code, title: this.icfTitle(element.code)};
                        });
                return SubCodes;
            };    
    icfTitle(string) {       
        const pData  = this.parseicfCode(string) ? this.parseicfCode(string) : '';
        const pRubric = this.codeRubric(pData, 'preferred');
        const pTitle = pRubric ? pRubric.Label['#text'] : '';
        //return title
        return pTitle ? pTitle : '';
    }
    icdTitle = (string) => {
        //TODO: add cropping to prevent overflowing with long titles
        const pData = this.parseicdCode(string) ? this.parseicdCode(string) : '';
        return pData ? pData.definition : '';
    }
    icfElement(string) {
        const Element = {};
        const eData  = string && this.parseicfCode(string) ? this.parseicfCode(string) : '';
        //debug
        //console.log('Code ' + string + ' data:', eData);
        //collect data
        if(eData) {
            Element.ctitle = this.codeRubric(eData, 'preferred').Label['#text'];      
            Element.cinc = this.codeRubric(eData, 'inclusion') !== this.codeRubric(eData, 'preferred') ? this.codeRubric(eData, 'inclusion') : '';  
            Element.cexc = this.codeRubric(eData, 'exclusion')  !== this.codeRubric(eData, 'preferred') ? this.codeRubric(eData, 'exclusion') : '';
            Element.cname = eData.code;
            //superclass prevention
            if (string.length > 1) {
                if (eData.SuperClass) {
                    Element.csuper = eData.SuperClass.code;
                    Element.csuptxt = this.icfTitle(eData.SuperClass.code);
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

