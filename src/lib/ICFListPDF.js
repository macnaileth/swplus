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
        let title = 'ICF-Liste (aus BPSM)';
        
        if ( !_.isEmpty( options ) ) {
            title = options.ndlist === true && options.icflist === true ? title + ' und Liste für die Bedarfserhebung' : 
                    options.ndlist === true && options.icflist === false ? 'Liste für die Bedarfserhebung' : title;
        }
        
        this.doc.setProperties({
                title: title,
                subject: 'ICF-Liste zur Nutzung bei der Bedarfsermittlung',
                author: 'social.werks+ - www.socialwerks.de',
                keywords: 'icf,Bedarfsermittlung,ICD-10,Hilfebedarf',
                creator: 'social.werks+ | jsPDF'
        });
        
        return title;
        
    }
    //creates intro block for icf/icd10 blocks
    createIntroBlock = (topDist, headline, desc = '') => {
        
        let yCoord = topDist;
        
        //headline
        this.doc.setFont( 'AlegreyaSans-Bold' );
        this.doc.setFontSize(16);
        this.doc.text( headline, 25, yCoord, { maxWidth: 165 });
        
        //create desc only if desc is not empty, otherwise we just have a headline
        if ( !_.isEmpty( desc ) ) {          
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
        }
        
        return yCoord;
        
    }
    //creates block for ICD-10 diagnoses
    createICDBlock = ( data, desc, topDist = 40, headline = 'Gesundheitsproblem', ) => {
        
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
                columnStyles: { key: { minCellWidth: 35 }, text: { minCellWidth: 130 } },
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
                columnStyles: { key: { minCellWidth: 35 }, text: { minCellWidth: 130 } },
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
        
        //finally, return needed data in object for further blocks
        return { posY: yCoord, pages: this.doc.lastAutoTable.pageCount };
    }
    
    createICFBlocks = ( data, topDist = 40, options = {} ) => {

        let yCoord = topDist;
        
        console.log('YCord at start of ICF table:' + yCoord);
        
        //create table data array
        const compICF = { b: [], s: [], d: [], e: [] };
        
        //create code boxes
        if ( !_.isEmpty( data ) ) {  
            //we have to sort the codes first -> b, s, d, e for each component
            data.map((element) => {
                
                let component = element.charAt(0);
                
                if ( component === 'b' ){
                    compICF.b.push({ key: element, text: this.parser.icfTitle( element, 180 ) });
                }
                if ( component === 's' ){
                    compICF.s.push({ key: element, text: this.parser.icfTitle( element, 180 ) });
                }   
                if ( component === 'd' ){
                    compICF.d.push({ key: element, text: this.parser.icfTitle( element, 180 ) });
                } 
                if ( component === 'e' ){
                    compICF.e.push({ key: element, text: this.parser.icfTitle( element, 180 ) });
                }                                
            });
           
        } 
        
        if ( !_.isEmpty( compICF.b ) ) {   
            yCoord = this.createIntroBlock( yCoord, 'b - ' + this.parser.icfTitle( 'b', 180 ) );
            yCoord = this.createICFTable( compICF.b, yCoord + 5, options ) + 8;
            
            console.log('yCoord after b: ' + yCoord);           
        }
        if ( !_.isEmpty( compICF.s ) ) { 
            yCoord = this.createIntroBlock( yCoord, 's - ' + this.parser.icfTitle( 's', 180 ) );
            yCoord = this.createICFTable( compICF.s, yCoord + 5, options ) + 8;
    
            console.log('yCoord after s: ' + yCoord);
        }    
        if ( !_.isEmpty( compICF.d ) ) { 
            yCoord = this.createIntroBlock( yCoord, 'd - ' + this.parser.icfTitle( 'd', 180 ) );
            yCoord = this.createICFTable( compICF.d, yCoord + 5, options ) + 8;
     
            console.log('yCoord after d: ' + yCoord);
        }     
        if ( !_.isEmpty( compICF.e ) ) { 
            yCoord = this.createIntroBlock( yCoord, 'e - ' + this.parser.icfTitle( 'e', 180 ) );
            yCoord = this.createICFTable( compICF.e, yCoord + 5, options ) + 8;
     
            console.log('yCoord after e: ' + yCoord);
        }         
        
        console.log('ICF Data', compICF);
        console.log('YCord after ICF table:' + yCoord);
        
        return yCoord;
        
    }
    
    createICFTable = ( tableData, yCoord, options ) => {
        
        console.log('YCord before ICF table:' + yCoord);
        
        autoTable(this.doc, {
            theme: 'grid',
            headStyles: {fillColor: [60, 60, 60], textColor: [255, 255, 255]},
            columnStyles: { key: {minCellWidth: 30}, grad: {minCellWidth: 30}, text: {minCellWidth: 105} },
            columns: [
                {header: 'Code', dataKey: 'key'},
                {header: 'Graduierung', dataKey: 'grad'},
                {header: 'Titel', dataKey: 'text'},
            ],
            body: tableData,
            startY: yCoord,
            margin: {top: 25, right: 20, bottom: 20, left: 25}
        }); 
        
        //do we have to create remark fields below each code block?
        if ( !_.isEmpty( options ) && options.remfields === true ) {
                autoTable(this.doc, {
                    theme: 'plain',
                    columnStyles: { remarks: { minCellWidth: 165, minCellHeight: 30, lineWidth: 0.25 } },
                    columns: [
                        { header: 'Anmerkungen', dataKey: 'remarks' },
                    ],
                    body: [
                        { remarks: '' },                    
                    ],
                    startY: this.doc.lastAutoTable.finalY,
                    margin: {top: 25, right: 20, bottom: 0, left: 25}
                });          
        }
        
        //return last y coordinate
        return this.doc.lastAutoTable.finalY;      
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
                            'Untenstehende Diagnosen sind ICD-10 verschlüsselt. Für weitere Informationen nutzen Sie die ICD-10, beim Bundesamt für Arzneimittel und Medizinprodukte (BfArM) herunterladbar.';
            const docTitle = this.setPDFProps( options );

            //title setup
            this.doc.setFont( 'AlegreyaSans-Thin' );
            this.doc.setFontSize(26);
            this.doc.text(docTitle, 25, 25, { maxWidth: 165 });

            //build ICD-10 diagnostics block
            posData = options.icd10 === true && this.createICDBlock( data.icd, icddesc );
            
            console.log( 'Table next Y: ' + Math.round(posData.posY) + ', Pages: ' + posData.pages );
            
            //title setup
            this.createIntroBlock( Math.round(posData.posY) + 16, 'ICF Codeauswahl', 'Ausgewählte Codes sortiert und zugeordnet den Komponenten der ICF (b, s, d, e).' ); 
            
            //build ICF Code block
            options.icf === true && this.createICFBlocks( data.icf, Math.round(posData.posY) + 34, options );
            
            
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
