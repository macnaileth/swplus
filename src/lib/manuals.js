/* 
 * Objects containing needed manuals for JSON processing
 */
//icf JSON - claml exported
import icfJSON from "../data/json/icf.json";
//icd10 JSON - HL7 FHIR version of ICD-10-GM 2020 DE
import icdJSON from "../data/json/icd.json";

const manualsWHO = {};

manualsWHO.icf = icfJSON.ClaML;
manualsWHO.icd = icdJSON.concept; //-> start at node concept parsing


export default manualsWHO;


