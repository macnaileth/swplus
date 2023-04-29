/**
 * SWMainNav React Navigation Component
 */
import React from 'react';

//WordPress Connector
import WPConnect from '../wpconnect/WPConnect.js';

//html-react-parser for html string conversion
import parse from 'html-react-parser';

 //internal ressources - old school
import LoadWait from '../components/LoadWait';

//react classes
export class SWContent extends React.Component {
    
    constructor(props) { 
        super(props); 
        this.apiContent = new WPConnect( 'https://wp.socialwerks.de' );
        this.state = {
            content: {},
            user: '',
            id: this.props.id,
            type: this.props.type
        };
        
        this.setContentData = this.setContentData.bind(this);   
        this.formatContent = this.formatContent.bind(this);  
        this.toDisplayDate = this.toDisplayDate.bind(this);
        this.userBox = this.userBox.bind(this);
        this.contentPagePost = this.contentPagePost.bind(this);
    };
    
    toDisplayDate = ( dateStr, splitAt = 'T', joinWith = ', ', separator = '.', revert = true, clockTime = true, clockStr = ' Uhr' ) => {
        
        const outputDate = dateStr === undefined ? '' : revert === true ? dateStr.split( splitAt )[0].split( '-' ).reverse().join( separator ) : dateStr.split( splitAt )[0];
        
        const dateObj = { 
                            date: outputDate, 
                            time: dateStr === undefined ? '' : dateStr.split( splitAt )[1] 
                        };
                
        
        return dateObj.date + joinWith + dateObj.time + clockStr;
        
    }    
    
    userBox = () => {
        return `<div class="card border-bottom-0 border-start-0 border-end-0">
                    <div class="card-body">
                        <div class="small d-block d-sm-flex justify-content-center">
                            <div class="text-center text-md-start">
                                <span class="text-secondary">Autor: </span>
                                <a href="${ this.state.user.url }" target="_blank" rel="noopener noreferrer">${ this.state.user.name }</a>
                            </div>
                            <div class="mx-md-4 mx-0 mx-sm-2 text-center text-md-start">
                                <span class="text-secondary"> verfasst am: </span>
                                <span class="text-info">${ this.toDisplayDate( this.state.content.date ) }</span>
                            </div>
                            <div class="">
                                <span class="text-secondary d-none d-md-inline"> zuletzt geändert: </span>
                                <span class="text-info d-none d-md-inline">${ this.toDisplayDate( this.state.content.modified ) }</span>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
    
    setContentData = async () => {
        
        const contentData = await this.apiContent.getContent( this.props.type, this.props.id );
        let userData = [];
        if ( this.props.type === 'pages' || this.props.type === 'posts' ) { 
            userData = await this.apiContent.getUser( contentData.author ); 
        }
        console.log( contentData );
        this.setState({ content: contentData, user: userData, id: this.props.id, type: this.props.type });      
    }; 
    
    contentPagePost = ( useTitle = true, useExcerpt = true, useLead = true, useDate = true, useAuthor = true, useModified = true ) => {
        const contentObj = {
            title : this.state.content.title === undefined ? '' : this.state.content.title !== true ? this.state.content.title.rendered : '',
            excerpt : this.state.content.excerpt === undefined ? '' :
                        useExcerpt === true ? 
                        useLead === true ? 
                        this.state.content.excerpt.rendered.replace(/<p>/, '<p class="lead">') : 
                                this.state.content.excerpt.rendered 
                        : '',
            meta: this.userBox(),
            content : this.state.content.content === undefined ? '' : this.state.content.content.rendered
        };

        return parse ( 
                        '<h1 class="display-6 text-secondary">' + contentObj.title + '</h1>' 
                        + contentObj.excerpt
                        + contentObj.content 
                        + contentObj.meta
                     );    
    }
    
    formatContent = ( useTitle = true, useExcerpt = true, useLead = true, useDate = true, useAuthor = true, useModified = true ) => {
        
        //console.log( 'user', this.state.user );
        console.log( 'type: ' + this.props.type + ', content:', this.state.content );
        
        switch ( this.props.type ) {
            //pages
            case 'pages': 
                return this.state.content.content === undefined ? <LoadWait /> : this.contentPagePost();
            //pages
            case 'posts':     
                return this.state.content.content === undefined ? <LoadWait /> : this.contentPagePost();            
            //tags         
            case 'tags':   
                return this.state.content.description === undefined ? <LoadWait /> : this.state.content.description;
            //categories         
            case 'categories':   
                return this.state.content.name === undefined ? <LoadWait /> : this.state.content.name;                
            //default catch    
            default:

                return 'Not Found!';
        };
    };

    componentDidMount() {
        this.setContentData();
        window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 
    }; 
    
    componentDidUpdate() {
        // Typical usage (don't forget to compare props):
        if ( this.state.id !== this.props.id || this.state.type !== this.props.type ) { 
            this.setContentData();
            window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 
        }       
        console.log( 'changed! ID: ' + this.state.id + ', update: ' + this.props.id );
    }    
    
    render() {
        return  (
                    <div>{ Object.keys( this.state.content ).length === 0 && this.state.content.constructor === Object ? <LoadWait /> : this.formatContent( this.state.content ) }</div> 
                );
    };
};

export default SWContent;
