/* 
 * basic helpers used anywhere around
 */

//settings from wpconnect
import settings from "../wpconnect/settings.json";  

/**
 * resolveTerms( type, taglist = true, catlist = true )
 * 
 * fixes routes if needed
 * 
 * @param {string} type
 * @param {bool} taglist
 * @param {bool} catlist
 * @returns {resolvedTerm}
 */
export const ResolveTerms = ( type, taglist = true, catlist = true ) => {
    let resolvedTerm = type;

    if ( taglist === true && type === 'tags' ) {
        const termArr = settings.routes.tagwise.split('/');
        resolvedTerm = termArr[ termArr.length - 2 ];
    }

    if ( catlist === true && type === 'categories'  ) {
        const termArr = settings.routes.catwise.split('/');
        resolvedTerm = termArr[ termArr.length - 2 ];        
    }        

    return resolvedTerm;
};

export const ResolveContentLink = ( link ) => {
    
        const linkArr = link.split('/');
        console.log( 'Linkage: ' + linkArr[ linkArr.length - 2 ] + '/' + linkArr[ linkArr.length - 1 ] );
        return { type: linkArr[ linkArr.length - 2 ], id: linkArr[ linkArr.length - 1 ] };         
};
/**
 * IsObject( value )
 * 
 * nice little function by Borislav Hadzhiev explained: 
 * https://bobbyhadz.com/blog/javascript-check-if-value-is-object
 * 
 * @param {type} value = the value to be checked if object
 * 
 * @returns {Boolean} = true if object, false if not
 */
export const IsObject = ( value ) => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
};


