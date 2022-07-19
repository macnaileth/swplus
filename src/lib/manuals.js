/* 
 * Objects containing needed manuals for JSON processing
 */

//icf JSON - claml exported
import icfJSON from "../data/json/icf.json";
//icd10 JSON - HL7 FHIR version of ICD-10-GM 2020 DE
import icdJSON from "../data/json/icd.json";
//modifiers for ICD-10 as separate file from ICD-10-GM 2022 DE ClaML version
import icdModJSON from "../data/json/icd_modifiers.json";

const manualsWHO = {};

manualsWHO.icf = icfJSON.ClaML;
manualsWHO.icd = icdJSON.concept; //-> start at node concept parsing
manualsWHO.icdMod = icdModJSON;


export default manualsWHO;


