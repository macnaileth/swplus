/* 
 * WPConnect
 * Class to connect to WordPress
 * For use with the wpconnect-theme
 * 
 * class needs the url to your wordpress site to work. 
 * basic configuration data is retrieved from settings.json. 
 * Normally you do not need to change this.
 */

//settings
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
     * @returns { unresolved } returns the menu as a promise on success, empty on fail
     */
    createMenu = async ( menu, getBy = 'NAME' ) => {
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
            console.log( 'Fetch failed (createMenu). Response HTTP-Error code: ' + response.status );
        }
    };

    /**
     * getContent( type, id )
     * 
     * 
     * @param { string } type = type of content
     * @param { string } id = id of the specific content dataset
     * @returns { unresolved } content json in a promise
     */
    getContent = async ( type, id ) => {
        const response = await fetch( this.home + settings.routes[ type ] + id );

        if (response.ok) {
            const content = await response.json();         
            return await content;
            
        } else {
            console.log( 'Fetch failed (getContent). Response HTTP-Error code: ' + response.status );
        }
  
    }
    /**
     * getUser ( id )
     * 
     * 
     * @param { string } id = the authors/users id
     * @returns { unresolved } = user json in a promise
     */
    getUser = async ( id ) => {
        const response = await fetch( this.home + settings.routes.users + id );

        if (response.ok) {
            const user = await response.json();         
            return await user;
            
        } else {
            console.log( 'Fetch failed (getUser). Response HTTP-Error code: ' + response.status );
        }
          
    }
    /**
     * getTermList( type = 'categories' )
     * 
     * @param { string } type: could be set to categories [default] or tags
     * @returns { promise } returns a list of all terms of type categories or tags
     */
    getTermList = async ( type = 'categories' ) => {
        let resolveType = type === 'categories' ? settings.routes.categories : type === 'tags' ? settings.routes.tags : '';
        const response = await fetch( this.home + resolveType );

        if (response.ok) {
            const TermList = await response.json();         
            return await TermList;
            
        } else {
            console.log( 'Fetch failed (getTermList). Response HTTP-Error code: ' + response.status );
        } 
        
    }
    /**
     * structureMenuFromJSON( menu )
     * 
     * @param { object } menu a menu object
     * @param { string } sortBy property to sort the menu array by. Default: order
     * @returns { promise } returns the restructured and ordered menu object
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
                return { uri: this.home + settings.routes.pages + itemID, route: 'internal', type: 'pages', id: itemID };
            //post
            case 1:
                return { uri: this.home + settings.routes.posts + itemID, route: 'internal', type: 'posts', id: itemID };  
            //category
            case 2:
                return { uri: this.home + settings.routes.categories + itemID, route: 'internal', type: 'categories', id: itemID };  
            //tag
            case 3: 
                return { uri: this.home + settings.routes.tags + itemID, route: 'internal', type: 'tags', id: itemID };  
            //link
            case 4:
                return { uri: !itemID.includes('http') ? 'https://' + itemID : itemID, route: 'external', type: 'link', id: itemID }; 
            //default
            default:
                return {};
        }
        
    };   
    
}
export default WPConnect;


