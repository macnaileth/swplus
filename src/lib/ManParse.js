/* 
 * Parser Class for ClaML manuals converted to JSON.
 */
class ManParse {
    constructor(manual) {
        this.manual = manual;
    }
    parseCode(string) {
        //find Code in Manual
        const Code = this.manual.icf.Class.find(element => element.code === string);
        return Code ? Code : undefined;
    }
    icfTitle(string) {       
        const pData  = this.parseCode(string) ? this.parseCode(string) : 0;
        const pRubric = pData && Array.isArray(pData.Rubric) ? 
                                pData.Rubric.find(element => element.kind === 'preferred') : 
                                pData.Rubric ? pData.Rubric : '';
        const pTitle = pRubric ? pRubric.Label['#text'] : '';
        //return title
        return pTitle ? pTitle : '';
    }
}
export default ManParse;

