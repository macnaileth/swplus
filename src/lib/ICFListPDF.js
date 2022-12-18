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
        
        this.docFonts = { bold: 'AlegreyaSans-Bold', regular: 'AlegreyaSans-Regular', thin: 'AlegreyaSans-Thin' };
    }
    
    setWordWrappingDefault = () => {
        this.doc.setFont( this.docFonts.regular );
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
        this.doc.setFont( this.docFonts.bold );
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
                headStyles: { fillColor: [60, 60, 60], textColor:  [255, 255, 255], font: this.docFonts.bold },
                columnStyles: { key: { minCellWidth: 35, font: this.docFonts.regular }, text: { minCellWidth: 130, font: this.docFonts.regular } },
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
                headStyles: { fillColor: [60, 60, 60], textColor:  [255, 255, 255], font: this.docFonts.bold },
                columnStyles: { key: { minCellWidth: 35, font: this.docFonts.regular }, text: { minCellWidth: 130, font: this.docFonts.regular } },
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
        
        return { posY: yCoord, pages: this.doc.lastAutoTable.pageCount };
        
    }
    
    //creates an icf table
    createICFTable = ( tableData, yCoord, options ) => {
        
        console.log('YCord before ICF table:' + yCoord);
        
        //create columns array
        const tabCols = [];
        tabCols.push( { header: 'Code', dataKey: 'key' } );
        options.gradfields === true && tabCols.push( { header: 'Graduierung', dataKey: 'grad' } );
        tabCols.push( { header: 'Titel', dataKey: 'text' } );
        
        autoTable(this.doc, {
            theme: 'grid',
            headStyles: {fillColor: [60, 60, 60], textColor: [255, 255, 255], font: this.docFonts.bold},
            columnStyles: { key: {minCellWidth: 30, font: this.docFonts.regular}, grad: {minCellWidth: 30, font: this.docFonts.regular}, text: {minCellWidth: 105, font: this.docFonts.regular} },
            columns: tabCols,
            body: tableData,
            startY: yCoord,
            margin: {top: 25, right: 20, bottom: 20, left: 25}
        }); 
        
        //do we have to create remark fields below each code block?
        if ( !_.isEmpty( options ) && options.remfields === true ) {
                autoTable(this.doc, {
                    theme: 'plain',
                    headStyles: {font: "AlegreyaSans-Bold"},
                    columnStyles: { remarks: { minCellWidth: 165, minCellHeight: 30, lineWidth: 0.25, font: this.docFonts.regular } },
                    columns: [
                        { header: 'Anmerkungen', dataKey: 'remarks' },
                    ],
                    body: [
                        { remarks: '' },                    
                    ],
                    startY: this.doc.lastAutoTable.finalY,
                    margin: {top: 25, right: 20, bottom: 20, left: 25}
                });          
        }
        
        //return last y coordinate
        return this.doc.lastAutoTable.finalY;      
    }
    //creates a block of personal factors
    createPFactorsBlock = ( strData, yCoord, options, createHeadline = true, headTxt = 'Personenbezogene Faktoren' ) => {  
        
        //insert headline
        yCoord = createHeadline === true ? this.createIntroBlock( yCoord, headTxt ) : yCoord;
        
        //static base config for both tables
        const tableConf = { theme: 'plain', minCellWidth: 165, minCellHeight: 30, margin: { top: 25, right: 20, bottom: 20, left: 25 } }
        
        //Build pFactors block
        if ( !_.isEmpty( strData ) && options.pfactors === true ) {
                autoTable(this.doc, {
                    theme: tableConf.theme,
                    columnStyles: { pfactors: { minCellWidth: tableConf.minCellWidth, minCellHeight: 0, lineWidth: 0, font: this.docFonts.regular } },
                    headStyles: {font: this.docFonts.bold},
                    columns: [
                        { header: 'Aus Biopsychosozialem Modell', dataKey: 'pfactors' },
                    ],
                    body: [
                        { pfactors: strData },                    
                    ],
                    startY: yCoord + 4,
                    margin: tableConf.margin,
                    showHead: 'firstPage'
                });          
        }
        if ( options.pfacfields === true ) { 
                autoTable(this.doc, {
                    theme: tableConf.theme,
                    columnStyles: { pfacform: { minCellWidth: tableConf.minCellWidth, minCellHeight: tableConf.minCellHeight, lineWidth: 0.25, font: this.docFonts.regular } },
                    headStyles: {font: this.docFonts.bold},
                    columns: [
                        { header: _.isEmpty( strData ) ? '' : 'Raum für Ergänzungen', dataKey: 'pfacform' },
                    ],
                    body: [
                        { remarks: '' },                    
                    ],
                    startY: !_.isEmpty( strData ) && options.pfactors === true ? this.doc.lastAutoTable.finalY : yCoord + 4,
                    margin: tableConf.margin
                });               
        }
        
        return { posY: this.doc.lastAutoTable.finalY, pages: this.doc.lastAutoTable.pageCount };
    } 
    
    //creates simple comment field
    createCommentField = ( yCoord, title = 'Bemerkungen') => {
        //insert headline
        yCoord = this.createIntroBlock( yCoord, title );   
        
        autoTable(this.doc, {
            theme: 'plain',
            columnStyles: { comments: { minCellWidth: 165, minCellHeight: 30, lineWidth: 0.25, font: this.docFonts.regular } },
            headStyles: {font: this.docFonts.bold},
            columns: [
                {header: title, dataKey: 'comments'},
            ],
            body: [
                { comments: '' },
            ],
            startY: yCoord + 4,
            margin: { top: 25, right: 20, bottom: 20, left: 25 }
        });
                
         return { posY: this.doc.lastAutoTable.finalY, pages: this.doc.lastAutoTable.pageCount };  
         
    }
    
    //creates a bpsm modell into a pdf page with landscape orientation - geoSetup defaults to optimal values for DIN A4 landscape format
    createBPSMforPDF = ( yCoord, data, geoSetup = { maxWidth: 247, boxWidth: 55.67, boxHeight: 30, marginX: 20, marginY: 20 } ) => {
        
        //create all needed geometry first
        const maxHeight = 210 - yCoord - 25;    
        const centerBoxX = ( this.doc.internal.pageSize.getWidth() / 2 ) - ( geoSetup.boxWidth / 2 );
        //second row x vals
        const leftBoxX = centerBoxX - ( geoSetup.boxWidth + geoSetup.marginX );
        const rightBoxX = centerBoxX + ( geoSetup.boxWidth + geoSetup.marginX );
        //third row x vals
        const lowerleftBoxX = centerBoxX - (( geoSetup.boxWidth / 2 ) + ( geoSetup.marginX / 2 ));
        const lowerrightBoxX = centerBoxX + (( geoSetup.boxWidth / 2 ) + ( geoSetup.marginX / 2 ));  
        //horizontal lines x vals
        //long lines
        const longhorLine = { 
                                startX: leftBoxX + ( geoSetup.boxWidth / 2 ), 
                                upperY: yCoord + geoSetup.boxHeight + ( geoSetup.marginY / 2 ),
                                lowerY: yCoord + ( geoSetup.boxHeight*2 ) + geoSetup.marginY + ( geoSetup.marginY / 3 ),
                                length: rightBoxX + ( geoSetup.boxWidth / 2 ) 
                            };
        //lower short line
        const shrthorLine = {
                                startX: lowerleftBoxX + ( geoSetup.boxWidth / 2 ),
                                length: lowerrightBoxX + ( geoSetup.boxWidth / 2 ),
                                vertY: yCoord + ( geoSetup.boxHeight*2 ) + geoSetup.marginY + (( geoSetup.marginY / 3 )*2)
                            };
        //row 2 between boxes lines
        const centerLines = {
                                startLineAX: leftBoxX + geoSetup.boxWidth, 
                                lengthLineA: centerBoxX,
                                startLineBX: centerBoxX + geoSetup.boxWidth,
                                lengthLineB: rightBoxX,
                                vertY: yCoord + geoSetup.boxHeight + geoSetup.marginY + ( geoSetup.boxHeight / 2 )
                            };
        //row 3 between boxes line
        const lowerLine  =  {
                                startX: lowerleftBoxX + geoSetup.boxWidth,
                                length: lowerrightBoxX,
                                vertY: yCoord + (geoSetup.boxHeight*2) + (geoSetup.marginY*2) +  ( geoSetup.boxHeight / 2 )           
                            };
        
        //set line widht
        this.doc.setLineWidth(0.25);
        
        //create first box - centered
        this.doc.rect( centerBoxX, yCoord, geoSetup.boxWidth, geoSetup.boxHeight );
        
        //create second row
        //box 1
        this.doc.rect( leftBoxX, yCoord + geoSetup.boxHeight + geoSetup.marginY, geoSetup.boxWidth, geoSetup.boxHeight );        
        //box 2
        this.doc.rect( centerBoxX, yCoord + geoSetup.boxHeight + geoSetup.marginY, geoSetup.boxWidth, geoSetup.boxHeight );
        //box 3
        this.doc.rect( rightBoxX, yCoord + geoSetup.boxHeight + geoSetup.marginY, geoSetup.boxWidth, geoSetup.boxHeight );  
        
        //create third row
        //box 1
        this.doc.rect( lowerleftBoxX, yCoord + (geoSetup.boxHeight*2) + (geoSetup.marginY*2), geoSetup.boxWidth, geoSetup.boxHeight ); 
        //box 2
        this.doc.rect( lowerrightBoxX, yCoord + (geoSetup.boxHeight*2) + (geoSetup.marginY*2), geoSetup.boxWidth, geoSetup.boxHeight ); 
        
        //draw lines & arrows
        
        //horizontal
        //upper
        this.doc.line( longhorLine.startX, longhorLine.upperY, longhorLine.length, longhorLine.upperY );
        //lower
        this.doc.line( longhorLine.startX, longhorLine.lowerY, longhorLine.length, longhorLine.lowerY );
        //lower short
        this.doc.line( shrthorLine.startX, shrthorLine.vertY, shrthorLine.length, shrthorLine.vertY );
        
        //between the center boxes
        //first line
        this.doc.line( centerLines.startLineAX, centerLines.vertY, centerLines.lengthLineA, centerLines.vertY );
        //second line
        this.doc.line( centerLines.startLineBX, centerLines.vertY, centerLines.lengthLineB, centerLines.vertY );
        
        //between the lower boxes
        this.doc.line( lowerLine.startX, lowerLine.vertY, lowerLine.length, lowerLine.vertY );
        
        //vertical
        
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
            this.doc.setFont( this.docFonts.thin );
            this.doc.setFontSize(26);
            this.doc.text(docTitle, 25, 25, { maxWidth: 165 });

            //build ICD-10 diagnostics block
            posData = options.icd10 === true && this.createICDBlock( data.icd, icddesc );
            
            console.log( 'Table next Y: ' + Math.round(posData.posY) + ', Pages: ' + posData.pages );
            
            //title setup
            this.createIntroBlock( Math.round(posData.posY) + 16, 'ICF Codeauswahl', 'Ausgewählte Codes sortiert und zugeordnet den Komponenten der ICF (b, s, d, e).' ); 
            
            //build ICF Code block
            posData = options.icf === true && this.createICFBlocks( data.icf, Math.round(posData.posY) + 34, options );
            
            //build personal factors
            if ( options.pfactors === true  || options.pfacfields === true ) {
                posData = this.createPFactorsBlock( data.pfactors, Math.round(posData.posY) + 8, options );
            }
            //Build comment fields
            posData = options.commfields === true && this.createCommentField( Math.round(posData.posY) + 16 );
            //TODO: Include BPSM if needed
            if ( options.bpsm === true ) {
                //first break page
                this.doc.addPage("a4", "l");
                //Add Page doc title
                this.doc.setFont( this.docFonts.thin );
                this.doc.setFontSize(26);
                this.doc.text('Biopsychosoziales Modell der ICF', this.doc.internal.pageSize.getWidth() / 2, 25, { maxWidth: 247, align: 'center' });  
                this.setWordWrappingDefault();
                //TODO: get the model onto the page
                this.createBPSMforPDF( 40, data );
            }
            
            //save doc finally if not already done
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
