/**
 * SWMainNav React Navigation Component
 */
import React from 'react';

//router links
import { Link } from "react-router-dom";


//WordPress Connector
import WPConnect from '../wpconnect/WPConnect.js';

//html-react-parser for html string conversion
import parse from 'html-react-parser';

//react boostrap stuff
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

 //internal ressources - old school
import LoadWait from '../components/LoadWait';
import Icons from '../lib/Icons';
import { ResolveContentLink, ResolveTerms } from '../lib/GenericHelpers';

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
        this.contentCatTagPostList = this.contentCatTagPostList.bind(this);

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
        return `<div class="sw-user-info card border-bottom-0 border-start-0 border-end-0">
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
    
    //TODO: Work this out!
    contentCatTagPostList = ( useFeatMedia = true, useExcerpt = true, useDate = true, useAuthor = true, useModified = true  ) => {
        
        const posts = this.state.content.posts;
        const postList = [];     
        
        const catTag = this.state.content.tag === undefined ? this.state.content.category : this.state.content.tag; 
        
        Object.entries( posts ).map(( item ) => {
                postList.push(  
                                <React.Fragment>  
                                      <Card className="sw-termlist-item px-0 rounded-end h-100" key={ item[1].id } id={ item[1].slug + '-' + item[1].id }> 
                                        <Row className="g-0">
                                            { item[1].featured_media.medium === false || useFeatMedia === false ? '' : <div className="sw-termlist-item-img col-2 border-end border-4 border-info" style={{ backgroundImage: `url( ${item[1].featured_media.medium} )`  }}></div> }
                                            <Col>
                                                <Card.Body className="shadow-sm">
                                                    <div className="h2">{ item[1].title.rendered }</div> 
                                                    <Card.Text>{ parse ( useExcerpt === true && item[1].excerpt.rendered ) }</Card.Text>  
                                                    <Card.Text>{ item[1].full }</Card.Text> 
                                                </Card.Body>
                                                <Card.Footer className="text-muted sw-termlist-item-info">
                                                    <Row className="align-items-center">
                                                        <Col className="pb-1 sw-termlist-item-cats">
                                                            { item[1].categories.map((element, index, array) => ( <Badge className="sw-clickbadge white" key={ element.id } pill bg="dark">
                                                                                                                    <Link to={ '/content/' + ResolveTerms ( ResolveContentLink( element.apilink ).type, true, true ) + '/' + ResolveContentLink( element.apilink ).id }>
                                                                                                                        { element.name }
                                                                                                                    </Link>
                                                                                                                  </Badge> )) } 
                                                        </Col>
                                                        { useDate === false && useAuthor === false && useModified === false ? '' :
                                                            <Col className="text-end">
                                                                <div className="d-inline me-2">
                                                                    { Icons.user }
                                                                    { useAuthor === true && item[1].author.name } 
                                                                </div>
                                                                <div className="d-inline me-2">
                                                                { Icons.clock }
                                                                { useDate === true && this.toDisplayDate( item[1].date_gmt, ' ' )  + ' ' }
                                                                </div>
                                                                <div className="d-inline">
                                                                { Icons.cycle }
                                                                { useModified === true && this.toDisplayDate( item[1].modified_gmt, ' ' ) }
                                                                </div>
                                                            </Col> 
                                                        }
                                                    </Row>
                                                </Card.Footer>                                                
                                            </Col>
                                        </Row>
                                      </Card>           
                                </React.Fragment>                                         
                            );       
        });    
        
        return ( 
                    <div id={ 'sw-term-' + catTag.term_id + '-' + catTag.slug }> 
                        <h1 class="display-6 text-secondary">{ catTag.name }</h1>
                        <Row className="mb-2">
                            <Col>{ catTag.description }</Col>
                            <Col className="text-end"><Badge pill bg="light" className="border border-info ms-2" text="info">{ catTag.count } Beiträge</Badge></Col>
                        </Row>
                        <Row className="sw-termlist g-4">{ postList }</Row> 
                    </div> 
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
            //taglist         
            case 'tagwise':      
                return this.state.content.posts === undefined ? <LoadWait /> : this.contentCatTagPostList();  
            //categories         
            case 'categories':   
                return this.state.content.name === undefined ? <LoadWait /> : this.state.content.description;      
            //catlist         
            case 'catwise':      
                return this.state.content.posts === undefined ? <LoadWait /> : this.contentCatTagPostList();          
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
