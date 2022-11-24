/**
 * ICFListPDF
 * -------------
 * Lib to create a ICF List PDF
 */
//copyright texts and version info
import cpText from "../data/json/copyright-txt.json";
//import fonts
import '../font/AlegreyaSans-Thin-normal.js';
import '../font/AlegreyaSans-Regular-normal.js';
import '../font/AlegreyaSans-Bold-normal.js';
//third party
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import _ from "lodash";
//local ressources
import ManParse from '../lib/ManParse';
//json manuals
import manualsWHO from '../lib/manuals';
Object.freeze(manualsWHO);

//start doc const
const timeStamp = Date.now();
//chars per line
const charsPerLine = 96;

class SWICFListPDF {
    
    constructor() { 
        this.doc = new jsPDF();
        
        this.parser = new ManParse(manualsWHO);
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
    //creates intro block for icf/icd10 blocks
    createIntroBlock = (topDist, headline, desc) => {
        
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
             
        //proceed  
        //calc
        let descLength = desc.length;
        let lineCount = Math.floor( descLength / charsPerLine );
        
        yCoord = ( this.doc.text.length * 10 ) + ( lineCount * 8 );  
        
        return yCoord;
        
    }
    //creates block for ICD-10 diagnoses
    createICDBlock = ( data, desc, topDist = 40, headline = 'ICD-10 Diagnosen', ) => {
        
        let yCoord = this.createIntroBlock( topDist, headline, desc );
        
        //create code box
        if ( !_.isEmpty( data ) ) {
            //create table array
            const tableData = data.map((element) => {
                return { key: element, text: this.parser.icdTitle( element, 180 ).title };
            });
            
            //give em codes
            autoTable(this.doc, {
                theme: 'grid',
                headStyles: { fillColor: [60, 60, 60], textColor:  [255, 255, 255] },
                columnStyles: { icdkey: { minCellWidth: 35 }, icdtext: { minCellWidth: 130 } },
                columns: [
                    { header: 'Schlüssel', dataKey: 'key' },
                    { header: 'Diagnose nach ICD-10', dataKey: 'text' },
                ],
                body: tableData,
                startY: yCoord,
                margin: {top: 0, right: 20, bottom: 0, left: 25}
              });            
            
        } else {
            //give em empty lines instead
            autoTable(this.doc, {
                theme: 'grid',
                headStyles: { fillColor: [60, 60, 60], textColor:  [255, 255, 255] },
                columnStyles: { icdkey: { minCellWidth: 35 }, icdtext: { minCellWidth: 130 } },
                columns: [
                    { header: 'Schlüssel', dataKey: 'key' },
                    { header: 'Diagnose nach ICD-10', dataKey: 'text' },
                ],
                body: [
                    { key: '', text: '' },
                    { key: '', text: '' },
                    { key: '', text: '' },
                    { key: '', text: '' },      
                    { key: '', text: '' },                    
                ],
                startY: yCoord-25,
                margin: {top: 25, right: 20, bottom: 0, left: 25}
              });            
        }
        //update y coordinate
        yCoord = this.doc.lastAutoTable.finalY;
        
        console.log('Whats in the table? ', this.doc.lastAutoTable);
        
        //finally, return needed data in object for further blocks
        return { posY: yCoord, pages: this.doc.lastAutoTable.pageCount };
    }
    
    createICFBlocks = ( data, topDist = 40, desc, headline = 'ICF-Codeauswahl' ) => {
        
        let yCoord = this.createIntroBlock( topDist, headline, desc );
        
        //create code boxes
        if ( !_.isEmpty( data ) ) {  
           //we have to sort the codes first -> b, s, d, e for each component
           
        }  
        
        return yCoord;
        
    }
    
    
    //creates the pdf finally - returns true on success, false on error
    createPDFfromData = ( name = 'sw-list-', options = {}, data = {} ) => {  
        
        //create new doc - overwrite old one if needed
        this.doc = new jsPDF();
        var posData = {};
        
        //just do it if options are set
        if ( !_.isEmpty( options ) ) {

            let icddesc = data.icd.length === 0 ?
                            'An dieser Stelle können ICD-10 verschlüsselte Diagnosen notiert werden. Bitte beachten Sie, dass Diagnosen nur von entsprechend geschultem Fachpersonal gestellt werden sollten.' :
                            'Untenstehende Diagnosen sind ICD-10 verschlüsselt. Für weitere Informationen nutzen Sie die ICD-10, die beim Bundesamt für Arzneimittel und Medizinprodukte (BfArM) vorliegt.';
            const docTitle = this.setPDFProps( options );

            //title setup
            this.doc.setFont( 'AlegreyaSans-Thin' );
            this.doc.setFontSize(26);
            this.doc.text(docTitle, 25, 25, { maxWidth: 165 });

            //build ICD-10 diagnostics block
            posData = options.icd10 === true && this.createICDBlock( data.icd, icddesc );
            
            console.log( 'Table next Y: ' + posData.posY + ', Pages: ' + posData.pages );
            
            //build ICF Code block
            options.icf === true && this.createICFBlocks( data.icf, posData.posY + 16, 'Ausgewählte Codes sortiert und zugeordnet den Komponenten der ICF (b, s, d, e).' );
            
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
