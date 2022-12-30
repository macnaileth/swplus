/* 
 * static helper functions to be used to handle who manual codes
 */

//third party
import _ from "lodash";

class ManHelper {
    //method to return an object including sorted icf codes according to the icf bps model
    //code array is an array of icf codes
    //returned object of arrayy will look like this: { "bsCodes": [], "eCodes": [], "aCodes": [], "pCodes": [] }
    static splitICFCodes = ( codeArray ) => {
        
        const sortedCodes = {   
                                "bsCodes": [], 
                                "eCodes": [],
                                "aCodes": [],
                                "pCodes": []
                            };
        
        !_.isEmpty(codeArray) && codeArray.map(( element ) => {  
            
            let firstChar = element.charAt(0);
            let secChar = element.charAt(1);
            
            if (firstChar === 'b' || firstChar === 's') {
                sortedCodes.bsCodes.push( element );
            } else if (firstChar === 'e') {
                sortedCodes.eCodes.push( element );
            } else if (firstChar === 'd') {
                if (secChar === '1' || secChar === '2' || secChar === '3' || secChar === '4') {
                    sortedCodes.aCodes.push( element );
                } else if (secChar === '5' || secChar === '6' || secChar === '7' || secChar === '8' || secChar === '9') { 
                    sortedCodes.pCodes.push( element );
                }
            }
            
        });                         
        return sortedCodes;     
    }    
    
}

export default ManHelper;


