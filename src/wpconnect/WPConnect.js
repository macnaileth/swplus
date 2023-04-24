/* 
 * WPConnect
 * Class to connect to WordPress
 * For use with the wpconnect-theme
 * 
 * class needs the url to your wordpress site to work. 
 * basic configuration data is retrieved from settings.json. 
 * Normally you do not need to change this.
 */

//icf JSON - claml exported
import settings from "./settings.json";  

class WPConnect { 
    
    constructor ( url ) {       
        this.home = url;   
    }  
    /**
     * createMenu( menu, getBy = 'NAME' )
     * 
     * @param { string } menu Menu name or key
     * @param { string } getBy NAME | KEY set if to get a menu by key (menu-3 or so) or by name ("my Menu")
     * @returns {undefined} returns the menu as a promise on success, empty on fail
     */
    async createMenu ( menu, getBy = 'NAME' ) {
        const response = await fetch( this.home + settings.routes.menus );
        
        let retrievedMenu = {};
        
        if (response.ok) {
            const menuStruct = await response.json();
            
            if ( getBy === 'NAME' ) {
                Object.entries( menuStruct.menus ).map(( element ) => {
                    if ( element[1].name === menu  ) {
                        retrievedMenu = element[1];
                    } 
                });   
            }
            
            if ( getBy === 'KEY' ) {
                retrievedMenu = menuStruct.menus[menu];
            }
            //Restructure before returning
            const resMenu = await this.structureMenuFromJSON( retrievedMenu );            
            return resMenu;
            
        } else {
            console.log( 'Fetch failed. Response HTTP-Error code: ' + response.status );
        }
    };
    
    //TODO: Write content render function
    renderContent = async () => {
        
    };
    
    /**
     * structureMenuFromJSON( menu )
     * 
     * @param { object } menu a menu object
     * @param { string } sortBy property to sort the menu array by. Default: order
     * @returns { object } returns the restructured and ordered menu object
     */   
     structureMenuFromJSON = ( menu, sortBy = 'order' ) => {
        
        let structure = [];
        
        Object.entries( menu ).map(( item ) => {
            
            if ( !item.includes('name') ) {
                structure.push({ 
                                    name: item[1].name, 
                                    order: item[1].order,
                                    link: this.createItemLink( item[1].type, item[1].id )
                                });
            } 
            
        });           
        
        return structure.sort( (a, b) => ( a[sortBy] > b[sortBy] ) ? 1 : -1 );
        
    };
    /**
     * createItemLink( itemType, itemID )
     * 
     * @param { int | string } itemType a supported type. can be:     
     * "0 - Page",
     * "1 - Post",
     * "2 - Category",
     * "3 - Tag",
     * "4 - Link" 
     * @param { int | string } itemID id of the object. Link object can be a url string, otherwise it should be a numeric id.
     * 
     * @returns { object } returns an object with two props: uri => the link, route => whether internal api link ('internal', types 0-3) 
     *                     or an link to something in the web ('external', type 4).
     */
    createItemLink = ( itemType, itemID ) => {
        
        switch( parseInt( itemType ) ) {
            //page
            case 0: 
                return { uri: this.home + settings.routes.pages + itemID, route: 'internal' };
            //post
            case 1:
                return { uri: this.home + settings.routes.posts + itemID, route: 'internal' };  
            //category
            case 2:
                return { uri: this.home + settings.routes.categories + itemID, route: 'internal' };  
            //tag
            case 3: 
                return { uri: this.home + settings.routes.tags + itemID, route: 'internal' };  
            //link
            case 4:
                return { uri: !itemID.includes('http') ? 'https://' + itemID : itemID, route: 'external' }; 
            //default
            default:
                return {};
        }
        
    };   
    
}
export default WPConnect;


