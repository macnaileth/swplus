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
    parseCode = (string) => {
        //find Code in Manual
        const Code = this.manual.icf.Class.find(element => element.code === string);
        return Code ? Code : undefined;
    };
    icfTitle(string) {       
        const pData  = this.parseCode(string) ? this.parseCode(string) : '';
        const pRubric = this.codeRubric(pData, 'preferred');
        const pTitle = pRubric ? pRubric.Label['#text'] : '';
        //return title
        return pTitle ? pTitle : '';
    }
    icfElement(string) {
        const Element = {};
        const eData  = this.parseCode(string) ? this.parseCode(string) : '';
        //collect data
        if(eData) {
            Element.ctitle = this.codeRubric(eData, 'preferred').Label['#text'];      
            Element.cinc = this.codeRubric(eData, 'inclusion') !== this.codeRubric(eData, 'preferred') ? this.codeRubric(eData, 'inclusion') : '';  
            Element.cexc = this.codeRubric(eData, 'exclusion')  !== this.codeRubric(eData, 'preferred') ? this.codeRubric(eData, 'exclusion') : '';
            Element.cname = eData.code;
            //superclass prevention
            if (string.length > 1) {
                Element.csuper = eData.SuperClass.code;
                Element.chint = this.codeRubric(eData, 'coding-hint').Label['#text'];
            }
            if (string.length < 2) {
                Element.cdef = this.codeMultiRubric(eData, 'definition');
            }
            Element.csub = eData.SubClass;
            Element.ckind = eData.kind;
        } else {
            Element.cerror = string + ' ist kein gültiges Element der ICF.';
        }
        return Element;
    }
}
export default ManParse;

