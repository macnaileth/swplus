/* 
 * Parser Class for ClaML manuals converted to JSON.
 */
class ManParse {
    constructor(manual) {
        this.manual = manual;
    }
    codeRubric = (data, string) => { 
            return data && Array.isArray(data.Rubric) ? 
                                    data.Rubric.find(element => element.kind === string) : 
                                    data.Rubric ? data.Rubric : '';           
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
        Element.ctitle = this.codeRubric(eData, 'preferred').Label['#text'];
        Element.chint = this.codeRubric(eData, 'coding-hint').Label['#text'];
        Element.cinc = this.codeRubric(eData, 'inclusion');  
        Element.cexc = this.codeRubric(eData, 'exclusion');
        Element.cname = eData.code;
        Element.csuper = eData.SuperClass.code;
        Element.csub = eData.SubClass;
        Element.ckind = eData.kind;
        return Element;
    }
}
export default ManParse;

