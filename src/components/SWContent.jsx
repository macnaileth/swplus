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
            relSegs: this.getRelURISegs(),
            user: ''
        };
        
        this.setContentData = this.setContentData.bind(this);  
        this.getRelURISegs = this.getRelURISegs.bind(this);  
        this.formatContent = this.formatContent.bind(this);  
        this.toDisplayDate = this.toDisplayDate.bind(this);
        this.userBox = this.userBox.bind(this);
    };
    
    getRelURISegs = () => {
        const uriSegs = this.props.url.substring(1).split("/");
        return uriSegs.splice(-2);        
    }
    
    toDisplayDate = ( dateStr, splitAt = 'T', joinWith = ', ', separator = '.', revert = true, clockTime = true, clockStr = ' Uhr' ) => {
        
        const outputDate = revert === true ? dateStr.split( splitAt )[0].split( '-' ).reverse().join( separator ) : dateStr.split( splitAt )[0];
        
        const dateObj = { 
                            date: outputDate, 
                            time: dateStr.split( splitAt )[1] 
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
        
        const contentData = await this.apiContent.getContent( this.state.relSegs[0], this.state.relSegs[1]);
        const userData = await this.apiContent.getUser( contentData.author );
        
        this.setState({ content: contentData, user: userData });      
    }; 
    
    formatContent = ( useTitle = true, useExcerpt = true, useLead = true, useDate = true, useAuthor = true, useModified = true ) => {
        
        console.log( 'user', this.state.user );
        console.log( 'content', this.state.content );
        
        const contentObj = {
            title : this.state.content.title.rendered,
            excerpt : useExcerpt === true ? 
                        useLead === true ? 
                        this.state.content.excerpt.rendered.replace(/<p>/, '<p class="lead">') : 
                                this.state.content.excerpt.rendered 
                        : '',
            meta: this.userBox(),
            content : this.state.content.content.rendered
        };
        console.log('date: ' + contentObj.date );
        return parse ( 
                        '<h1 class="display-6 text-secondary">' + contentObj.title + '</h1>' 
                        + contentObj.excerpt
                        + contentObj.content 
                        + contentObj.meta
                     );
    };

    componentDidMount() {
        this.setContentData();
        window.scrollTo(0, 0);
    }; 
    
    componentDidUpdate() {
        // Typical usage (don't forget to compare props):
          console.log( 'changed! ' );
    }    
    
    render() {
        return  (
                    <div>{ typeof this.state.content.content !== 'undefined' ? this.formatContent( this.state.content ) : <LoadWait /> }</div> 
                );
    };
};

export default SWContent;
