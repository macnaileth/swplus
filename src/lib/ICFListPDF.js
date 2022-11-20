/**
 * ICFListPDF
 * -------------
 * Lib to create a ICF List PDF
 */

//import fonts
import '../font/AlegreyaSans-Thin-normal.js';
import '../font/AlegreyaSans-Regular-normal.js';
import '../font/AlegreyaSans-Bold-normal.js';

import { jsPDF } from "jspdf";
import _ from "lodash";

//start doc const
const timeStamp = Date.now();

class SWICFListPDF {
    
    constructor() { 
        this.doc = new jsPDF();
    }
    
    setWordWrappingDefault = () => {
        this.doc.setFont( 'AlegreyaSans-Regular' );
        this.doc.setFontSize(12);       
    }
    
    // sets PDF props and returns the title for furhter use as a string
    setPDFProps = ( options = {} ) => {
        
        //generate title
        let title = 'ICF-Liste';
        
        if ( !_.isEmpty( options ) ) {
            title = options.ndlist === true && options.icflist === true ? title + ' und Liste für die Bedarfserhebung' : 
                    options.ndlist === true && options.icflist === false ? 'Liste für die Bedarfserhebung' : title;
        }
        
        this.doc.setProperties({
                title: title,
                subject: 'ICF-Liste zur Nutzung zur Bedarfsermittlung',
                author: 'social.werks+ - www.socialwerks.de',
                keywords: 'icf,Bedarfsermittlung,ICD-10,Hilfebedarf',
                creator: 'social.werks+ | jsPDF'
        });
        
        return title;
        
    }
    //creates block for ICD-10 diagnoses
    createICDBlock = ( data, desc, topDist = 40, headline = 'ICD-10 Diagnosen', ) => {
        
        let yCoord = topDist;
        
        //headline
        this.doc.setFont( 'AlegreyaSans-Bold' );
        this.doc.setFontSize(16);
        this.doc.text( headline, 25, yCoord, { maxWidth: 165 });
        
        //proceed on doc
        yCoord += 8;
        
        //set text to default float text size
        this.setWordWrappingDefault();
        this.doc.text( desc, 25, yCoord, { maxWidth: 165 });
        
        //create borders and stuff
        
        //create code box
        if ( !_.isEmpty( data ) ) {
            //give em codes
        } else {
            //give em empty lines instead
        }
    }
    
    //creates the pdf finally - returns true on success, false on error
    createPDFfromData = ( name = 'sw-list-', options = {}, data = {} ) => {  
        
        //create new doc - overwrite old one if needed
        this.doc = new jsPDF();
        
        //just do it if options are set
        if ( !_.isEmpty( options ) ) {

            let icddesc = data.icd.length === 0 ?
                            'An dieser Stelle können ICD-10 verschlüsselte Diagnosen notiert werden. Bitte beachten Sie, dass Diagnosen nur von entsprechend geschultem Fachpersonal gestellt werden sollten.' :
                            'Untenstehende Diagnosen sind ICD-10 verschlüsselt. Für weitere Informationen nutzen Sie die ICD-10, die in der aktuellen Version beim Bundesamt für Arzneimittel und Medizinprodukte (BfArM) vorliegt.';
            const docTitle = this.setPDFProps( options );

            //title setup
            this.doc.setFont( 'AlegreyaSans-Thin' );
            this.doc.setFontSize(26);
            this.doc.text(docTitle, 25, 25, { maxWidth: 165 });

            //build ICD-10 diagnostics block
            options.icd10 === true && this.createICDBlock( data.icd, icddesc );

            //save doc finally
            this.doc.save( name + timeStamp + ".pdf" );  

            console.log('PDF File "' + name + timeStamp + '" created succesfully');
            console.log('Received Options: ', options);
            console.log('Received Data: ', data);
            
            return true;
        } else {
            return false;
        }
    }
    
};

export default SWICFListPDF;
