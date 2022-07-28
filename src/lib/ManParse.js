/* 
 * Parser Class for ClaML manuals converted to JSON.
 */

//third party
import _ from "lodash";

class ManParse {
    constructor(manual) {
        this.manual = manual; 
        this.icdchap = /^[IVX]{1,5}$/gmi;
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
    parseicdCode = (string, crop = false) => {
        //we have to do some checks before returning to fallback to the last correct code
        let counter = 4;
        let cropStr = string;
        let code = {};
        
        if (crop === true) {
            for (let i = 0; i < counter; i++){
                code = this.manual.icd.find(element => element.code === cropStr.toUpperCase());   
                if (!_.isEmpty(code)) {
                    code.cropres = cropStr;
                    //console.log('code found: ', code);
                } else {
                    cropStr = cropStr.slice(0, -1);
                    //console.log('code cropped to: ', cropStr);
                }
            }
        } else {
            code = this.manual.icd.find(element => element.code === cropStr.toUpperCase()); 
        } 
        //const Code = this.manual.icd.find(element => element.code === string.toUpperCase());
        return code ? code : undefined;
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
                            SubCodes[index] = {code: element, title: this.icdTitle(element, 300).title};
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
    /*
     * method to find the modifier digit text. needs the full data object returned by parseicdCode()
     * when parsing the first part of the parent block (icd-10 parent block: fxx-fyy, needed is fxx).
     * 
     * pastDotPart is the part of the icd code past the dot to look up, .xx (including the dot).
     * 
     * Also needed is to tell if digit four or five is wanted, defaults to 4
     * 
     * automatically checks if data rubric is an array or an object and returns accordingly
     */
    icdModifierText = ( data, pastDotPart, digit = 4 ) => {
        const digitStr = digit === 4 ? '4.' : digit === 5 ? '5.' : '4.';
        const modBase = this.icdModGroup(digitStr, _.find(data.property, ['code', 'parent']).valueCode);
        const modText = modBase ? !_.isEmpty(modBase.four) && digit === 4 ? modBase.four.sub.find(element => element.code === pastDotPart.substring(0,2)) : 
                        !_.isEmpty(modBase.five) && digit === 5 ? modBase.five.sub.find(element => element.code === pastDotPart.substring(2,3)) : '' : '';
        return modText ? _.isArray(modText.Rubric) ? modText.Rubric.find(element => element.kind === "preferred").Label['#text'] : modText.Rubric.Label['#text'] : '';    
    }
    icdTitle = (string, charLimit = 40, icdchapter = false, elipsis = '...') => {
        
        //optimize string for parsing to allow Zusatzkennzeichen :-)
        let parseStr = icdchapter === false ? this.isICDSpecChar(string.slice(-1)) === true ? string.slice(0, -1) : string : string;
        
        let pData = this.parseicdCode(parseStr) ? this.parseicdCode(parseStr) : '';
        const frontDotPart = string.substring(0,3);
        
        if( string.length > 4 && pData === '' && string.charAt(3) === '.') {
            const pastDotPart = string.substring(3);
            if(string.length === 5) {   
                pData = this.parseicdCode(frontDotPart);
                //get modifier group text
                const pModGroup = this.icdModifierText(pData, pastDotPart, 4);

                pData.modText = pModGroup ? pModGroup : '';
                pData.modCode = pModGroup ? pastDotPart.substring(0,2) : '';
                //reset possible fifth digit
                pData.modFText = '';
                pData.modFCode = '';
                console.log('Viersteller (' + string.length + ' | ' + frontDotPart + ' | ' + pastDotPart + ')', pData.modText);
            }
            //also check for additional flags and special chars, like a traling g, v, or so - to prevent code invalidation
            if( string.length === 6 || (string.length === 7 && this.isICDSpecChar(string.substring(6,7))) ) {
                //TODO: work this
                const SplitPastDotPart = { four: pastDotPart.substring(0,2), five: pastDotPart.substring(2,3) };
                //first, check if we find digit 4 - if not, code is invalid anyway
                pData = this.parseicdCode(frontDotPart);
                //get modifier group text
                const pModGroup = this.icdModifierText(pData, pastDotPart, 4);                
                //second, check for digit 5
                const pModFive = this.icdModifierText(pData, pastDotPart, 5); 

                pData.modText = pModGroup ? pModGroup : '';
                pData.modCode = pModGroup ? SplitPastDotPart.four : ''; 
                pData.modFText = pModFive ? pModFive : '';
                pData.modFCode = pModFive ? SplitPastDotPart.five : '';
                console.log('Fünfsteller (' + string.length + ' | ' + pastDotPart + 
                        ') , Splitted: Four: ' + SplitPastDotPart.four + ', ' + pData.modText +
                        ', Five: ' + SplitPastDotPart.five + ', ' + pData.modFText );
            }
        }      
        return pData ? pData.display.length > charLimit ?
                { title: pData.display.substring(0, charLimit) + elipsis, 
                  modtext: pData.modText ? pData.modText : '', 
                  modcode: pData.modCode ? pData.modCode : '',
                  modftext: pData.modFText ? pData.modFText : '',
                  modfcode: pData.modFCode ? pData.modFCode : '' } : 
                { title: pData.display, 
                  modtext: pData.modText ? pData.modText : '', 
                  modcode: pData.modCode ? pData.modCode : '',
                  modftext: pData.modFText ? pData.modFText : '',
                  modfcode: pData.modFCode ? pData.modFCode : '' } : '';
    }
    icdaddFlags = (string) => {
        //TODO: put additional flags, special char parsing in here this.manual.icdAdd.find( (element, index) => index === lastChar )
        const lastChar = string.slice(-1);
        return this.isICDSpecChar( lastChar ) && string[string.length - 2] !== '.' ? { text: this.manual.icdAdd[lastChar.toUpperCase()], char: lastChar } : {};
    }    
    isICDSpecChar = ( char ) => {
        return (/[GVAZRLB]/gmi).test( char );
    }
    icdResolveMod = (stringMod, stringCode) => {
        const resModifier = _.find(this.manual.icdMod.ModifierClass, { 'code': stringMod, 'modifier': stringCode });
        return resModifier;
    }
    icdModDigits = (string) => {
        const digits = {};
        string.includes('4.') === true ? digits.four = true : digits.four = false;
        string.includes('5.') === true ? digits.five = true : digits.five = false;
        return digits;
    }
    icdModifiers = (string, hiDigit = undefined) => {
        const Modifiers = this.manual.icdMod.Modifier.find( element => element.code.includes(string));
        const ModElement = {};
        
        //build modifier element
        if (Modifiers !== undefined) {
            ModElement.label = 'Label' in Modifiers.Rubric ? Modifiers.Rubric.Label.Para : ''; //Label text
            ModElement.kind = Modifiers.Rubric.kind;
            ModElement.code = Modifiers.code;
            //resolve subcodes of modifiers
            ModElement.sub = [];
            Modifiers.SubClass.map( (element, index) => { ModElement.sub[index] = this.icdResolveMod(element.code, ModElement.code); } );
            //apply highlight if have to
            ModElement.hilite = !_.isEmpty(hiDigit) ? hiDigit : '';
        }
        console.log('Prepared String: '+ hiDigit, ModElement);
        return ModElement;
    }
    icdGetValidModifierCode = (string, interval = 15) => {
        let modLead = string.substr(0,1);
        let modNum  = string.substr(1,2) !== "00" ? parseInt(string.substr(1,2)) : string.substr(1,2);
        let modTrail = string.substr(3,4);
        let counter = modNum + interval;
        //return directly if "00" because we need not to iterate
        //iterate a limited number of times as defined in counter to check if we can find a valid code
        for (let i = modNum; i < counter; i++){
            let iNum = i;
            let padNum = iNum < 10 && iNum > 0 ? "0" + iNum : iNum;
            const Modifiers = this.manual.icdMod.Modifier.find( element => element.code.includes( modLead + padNum + modTrail ));
            if ( Modifiers !== undefined) {
                return modLead + padNum + modTrail;
            }
        }
        return undefined;
    }
    //stringMod = modLink string, stringSuper = Super Class block, for ex. E10-E14, stringCode = ICD-10 Code 
    icdModGroup = (stringMod, stringSuper, stringCode) => {
        const digits = this.icdModDigits(stringMod);
        const superFirst = stringSuper.substr(0,3);
        const digitVals = stringCode !== undefined && stringCode.includes('.') ? { four: stringCode.length === 5 ? stringCode.slice(-1) : stringCode[stringCode.length - 2], 
                                                                                   five: stringCode.length === 6 ? stringCode.slice(-1) : undefined } : undefined;
        const modifierElement = {};
        
        if ( digits.four === true ){
            //string for modifier retrieval
            const needle = this.icdModifiers( this.icdGetValidModifierCode(superFirst + '_4'), digitVals !== undefined && digitVals.four );
            modifierElement.four = needle;
        } else { modifierElement.four = {} };
        if ( digits.five === true ){
            const needle = this.icdModifiers( superFirst + '_5', digitVals !== undefined && digitVals.five );
            modifierElement.five = needle;
        } else { modifierElement.five = {} }
        return modifierElement;
    }
    icdElement(string) {
        const Element = {};
        
        //before parsing, prepare string
        let prepStr = !this.icdchap.test(string) ? this.isICDSpecChar(string.slice(-1)) ? string.slice(0, -1) : string : string;
        const cSpecData = this.isICDSpecChar(string.slice(-1)) ? ( string ? this.icdaddFlags(string) : undefined ) : undefined;
        
        const cData = prepStr && this.parseicdCode(prepStr, true) ? this.parseicdCode(prepStr, true) : '';
        
        if(cData) {
            Element.cspecChar = cSpecData;
            Element.ctype = 'icd-10';
            Element.cname = string.toUpperCase();
            Element.ctitle = cData.display;
            Element.cdef = cData.definition;
            Element.ckind = _.find(cData.property, ['code', 'kind']).valueCode;
            
            if(cData.property.find(element => element.code === 'parent')) {
                Element.csuper = _.find(cData.property, ['code', 'parent']).valueCode;
                Element.csuptxt = this.icdchap.test(Element.csuper) ? this.icdTitle(Element.csuper, 300, true).title : this.icdTitle(Element.csuper, 300, false).title;
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
            Element.cmodifiers = [];
            if(Element.cmodLink !== '') {
                //we have a modifier link, so we have to get the modifiers acoording to the digits
                Element.cmodifiers = this.icdModGroup(Element.cmodLink, Element.csuper, prepStr);   
                //chop of digit 5 from code name if not allowed and if not a zusatzkennzeichen
                if (this.icdModDigits(Element.cmodLink).five === false) {   
                    //crop name to correct length if overtyped
                    Element.cname = this.icdCropInvalidDigits(Element.cname);
                };
            } else {
                Element.cmodifiers = {};
                //crop name to correct length if overtyped - check for chapter
                console.log('Element Name (no modifiers): ', Element.cname);  
                if (!Element.cname.includes('.')) {
                    //TODO: still have to fix this conditional to work
                    let specTrail = this.isICDSpecChar(Element.cname.slice(-1)) && this.icdchap.test(Element.cname) ? Element.cname.slice(-1) : '';        
                    
                    specTrail = specTrail.toLowerCase() === 'v' && /^\d+$/.test(Element.cname[Element.cname.length - 2]) ? specTrail : '';
                    
                    console.log('Element Name cutted (Spec Trail: ' + specTrail + ', Sliced: ' + Element.cname.slice(-1) + ', Zusatzkennzeichen? ' + this.isICDSpecChar(Element.cname.slice(-1)) +'): ', Element.cname);  
                    Element.cname = cData.code + specTrail;

                } else {
                    Element.cname = this.icdCropInvalidDigits(Element.cname);
                }                    
                
            }
            
        } else {
            Element.cerrstr = string === undefined ? 'VOID' : '';
            Element.cerror = string ? string + ' ist kein gültiges Element der ICD-10.' : 'Kein Element gefunden.';
        }
        
        console.log('ICD-10 Data: ', cData);
        console.log('ICD-10 Element: ', Element);
        return Element;
    }
    icdCropInvalidDigits = (string) => {
        if (string.length === 7) {
            return string.slice(0, 5) + string.slice(6);
        } else if (string.length === 6) {
            if (!this.isICDSpecChar(string.slice(-1))) {
                return string.slice(0, 5) + string.slice(6);
            }
        } 
        return string;
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
    parseError() {
        const Element = {};
        Element.cerrstr = '';
        Element.cerror = 'Kein Element gefunden.';  
        return Element;
    }
}
export default ManParse;

