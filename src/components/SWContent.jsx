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
            type: this.props.type, 
            metadata: { tags: {}, cats: {} }
        };
        
        this.setContentData = this.setContentData.bind(this);   
        this.formatContent = this.formatContent.bind(this);  
        this.toDisplayDate = this.toDisplayDate.bind(this);
        this.userBox = this.userBox.bind(this);
        this.contentPagePost = this.contentPagePost.bind(this);
        this.contentCatTagPostList = this.contentCatTagPostList.bind(this);
        this.setMetaData = this.setMetaData.bind(this);
        this.metaBox = this.metaBox.bind(this);

    };
    
    toDisplayDate = ( dateStr, splitAt = 'T', joinWith = ', ', separator = '.', revert = true, clockTime = true, clockStr = ' Uhr' ) => {
        
        const outputDate = dateStr === undefined ? '' : revert === true ? dateStr.split( splitAt )[0].split( '-' ).reverse().join( separator ) : dateStr.split( splitAt )[0];
        
        const dateObj = { 
                            date: outputDate, 
                            time: dateStr === undefined ? '' : dateStr.split( splitAt )[1] 
                        };
                
        
        return dateObj.date + joinWith + dateObj.time + clockStr;
        
    }  
    metaBox = ( useCats = true, useTags = true ) => {
        
        return (
                    <React.Fragment>
                        { this.state.content.categories === undefined && this.state.content.tags === undefined ? '' :
                            <div className="d-flex justify-content-between sw-metabox mb-3 small">
                                { useCats === true && this.state.content.categories !== undefined &&
                                    <div className="sw-termlist-item-info sw-post">
                                        <span className="pe-2">{ Icons.folder }</span>
                                        { this.state.content.categories.map(( element, index ) => ( 
                                            <Badge className="sw-clickbadge white" key={ index } pill bg="dark">
                                                <Link to={ '/content/catwise/' + element }>
                                                    { 
                                                        this.state.metadata.cats === undefined ? 
                                                            <LoadWait /> : 
                                                                this.state.metadata.cats.map( ( cat ) => ( cat.id === element && <React.Fragment>{ cat.name }</React.Fragment> ) )
                                                    }
                                                </Link>
                                            </Badge> 
                                        )) }  
                                    </div>
                                }
                                { useTags === true && this.state.content.tags !== undefined &&
                                    <div className="sw-termlist-item-info sw-post">
                                        <span className="pe-2">{ Icons.colours }</span>
                                        { this.state.content.tags.map(( element, index ) => ( 
                                            <Badge className="sw-clickbadge white" key={ index } pill bg="dark">
                                                <Link to={ '/content/tagwise/' + element }>
                                                    { 
                                                        this.state.metadata.tags === undefined ? 
                                                            <LoadWait /> : 
                                                                this.state.metadata.tags.map( ( tag ) => ( tag.id === element && <React.Fragment>{ tag.name }</React.Fragment> ) )
                                                    }
                                                </Link>
                                            </Badge> 
                                        )) }  
                                    </div>
                                }  
                            </div>
                        }
                    </React.Fragment>
                );
    }
    
    userBox = () => {

        return (    <div className="sw-user-info border-top">
                        <div className="small d-block d-sm-flex justify-content-between mt-3">                          
                            <div className="text-center text-md-start">
                                <span className="text-secondary">Autor: </span>
                                <a href={ this.state.user.url } target="_blank" rel="noopener noreferrer">{ this.state.user.name }</a>
                            </div>
                            <div className="mx-md-4 mx-0 mx-sm-2 text-center text-md-start">
                                <span className="text-secondary"> verfasst am: </span>
                                <span className="text-info">{ this.toDisplayDate( this.state.content.date ) }</span>
                            </div>
                            <div className="d-none d-md-block">
                                <span className="text-secondary"> zuletzt geändert: </span>
                                <span className="text-info">{ this.toDisplayDate( this.state.content.modified ) }</span>
                            </div>
                        </div>
                    </div> );
    }
    
    setContentData = async () => {
        
        const contentData = await this.apiContent.getContent( this.props.type, this.props.id );
        let userData = [];
        if ( this.props.type === 'pages' || this.props.type === 'posts' ) { 
            userData = await this.apiContent.getUser( contentData.author ); 
        }
        this.setState({ content: contentData, user: userData, id: this.props.id, type: this.props.type });      
    }; 
    
    setMetaData = async () => {
        
        const metaData = { cats: await this.apiContent.getTermList(), tags: await this.apiContent.getTermList( 'tags' ) };

        this.setState({ metadata: { tags: metaData.tags, cats: metaData.cats } });      
    }; 
    
    contentPagePost = ( useTitle = true, useExcerpt = true, useLead = true, useDate = true, useAuthor = true, useModified = true ) => {
        const contentObj = {
            meta: this.metaBox(),
            title : this.state.content.title === undefined ? '' : this.state.content.title !== true ? this.state.content.title.rendered : '',
            excerpt : this.state.content.excerpt === undefined ? '' :
                        this.props.type === 'pages' ? '' :
                        useExcerpt === true ? 
                        useLead === true ? 
                        this.state.content.excerpt.rendered.replace(/<p>/, '<p class="lead">') : 
                                this.state.content.excerpt.rendered 
                        : '',
            userinfo: this.userBox(),
            content : this.state.content.content === undefined ? '' : this.state.content.content.rendered
        };

        return  (   
                    <React.Fragment>
                        { contentObj.meta }
                        <h1 className="display-6 text-secondary"> { contentObj.title } </h1> 
                        { parse ( contentObj.excerpt ) }
                        { parse ( contentObj.content ) }
                        { contentObj.userinfo }
                    </React.Fragment>
                );    
    }
    
    contentCatTagPostList = ( useFeatMedia = true, useExcerpt = true, useDate = true, useAuthor = true, useModified = true  ) => {
        
        const posts = this.state.content.posts;
        const postList = [];     
        
        const catTag = this.state.content.tag === undefined ? this.state.content.category : this.state.content.tag; 
        
        Object.entries( posts ).map(( item ) => {
                postList.push(  
                              <Card className="sw-termlist-item px-0 h-100" key={ item[1].id } id={ item[1].slug + '-' + item[1].id }> 
                                <Row className="g-0">
                                    { item[1].featured_media.medium === false || useFeatMedia === false ? '' : <div className="sw-termlist-item-img col-sm-12 col-md-4 col-lg-2" style={{ backgroundImage: `url( ${item[1].featured_media.medium} )`  }}></div> }
                                    <Col>
                                        <Card.Body className="shadow-sm">
                                            <div className="h2">{ item[1].title.rendered }</div> 
                                            <Card.Text>{ parse ( useExcerpt === true && item[1].excerpt.rendered ) }</Card.Text>  
                                            <Card.Text className="sw-termlist-item-linkto">
                                                <Link to={ '/content/' + ResolveContentLink( item[1].full ).type + '/' + ResolveContentLink( item[1].full ).id }>
                                                    <span className="icon-primary">{ Icons.forward }</span>Vollständigen Beitrag lesen
                                                </Link>
                                            </Card.Text> 
                                        </Card.Body>
                                        <Card.Footer className="text-muted sw-termlist-item-info">
                                            <Row className="align-items-center">
                                                <Col className="pb-1 sw-termlist-item-cats sw-termlist-item-tags">
                                                    <span className="ps-1 pe-2">{ Icons.folder }</span>
                                                    { item[1].categories.map((element, index, array) => ( <Badge className="sw-clickbadge white" key={ element.id } pill bg="dark">
                                                                                                            <Link to={ '/content/' + ResolveTerms ( ResolveContentLink( element.apilink ).type, true, true ) + '/' + ResolveContentLink( element.apilink ).id }>
                                                                                                                { element.name }
                                                                                                            </Link>
                                                                                                          </Badge> )) } 
                                                    <span className="ps-2 pe-2">{ Icons.colours }</span>
                                                    { item[1].tags.map((element, index, array) => ( <Badge className="sw-clickbadge white" key={ element.id } pill bg="dark">
                                                                                                            <Link to={ '/content/' + ResolveTerms ( ResolveContentLink( element.apilink ).type, true, true ) + '/' + ResolveContentLink( element.apilink ).id }>
                                                                                                                { element.name }
                                                                                                            </Link>
                                                                                                          </Badge> )) } 
                                                </Col>                                                        
                                                { useDate === false && useAuthor === false && useModified === false ? '' :
                                                    <Col md={ 12 } lg={ 6 }>
                                                        <Row> 
                                                            { useAuthor === true && 
                                                                <Col xs={ 6 } md={ 2 } lg={ 4 } xl={ 2 } className="text-lg-end text-md-start text-start">
                                                                    { Icons.user }
                                                                            <a target="_blank" rel="noopener noreferrer" href={ item[1].author.url }>{ item[1].author.name }</a>  
                                                                </Col> 
                                                            }
                                                            { useDate === true &&                                                             
                                                                <Col xs={ 6 } md={ 10 } lg={ 8 } xl={ 5 } className="text-end">
                                                                    { Icons.clock }
                                                                    { this.toDisplayDate( item[1].date_gmt, ' ' )  + ' ' }
                                                                </Col> 
                                                            }
                                                            { useModified === true && 
                                                                <Col className="d-xl-block d-none text-end" xl={ 5 }>
                                                                    { Icons.cycle }
                                                                    { this.toDisplayDate( item[1].modified_gmt, ' ' ) }
                                                                </Col>
                                                            }
                                                        </Row>
                                                    </Col> 
                                                }
                                            </Row>
                                        </Card.Footer>                                                
                                    </Col>
                                </Row>
                              </Card>                                                   
                            );       
        });    
        
        return ( 
                    <div id={ 'sw-term-' + catTag.term_id + '-' + catTag.slug }> 
                        <h1 className="display-6 text-secondary">{ catTag.name }</h1>
                        <Row className="mb-2 py-2 shadow-sm rounded-bottom border-bottom bg-light">
                            <Col xs={ 12 } lg={ 10 } className="text-dark">{ catTag.description }</Col>
                            <Col className="text-end"><Badge pill bg="light" className="border border-info ms-2" text="info">{ catTag.count } Beiträge</Badge></Col>
                        </Row>
                        <Row className="sw-termlist g-4">{ postList }</Row> 
                    </div> 
               );      
        
    }
    
    formatContent = ( useTitle = true, useExcerpt = true, useLead = true, useDate = true, useAuthor = true, useModified = true ) => {
        
        console.log( '%c*** Content succesfully loaded (' + this.props.type + ') ***', 'color:green;' );
        
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
        if ( this.props.type === 'posts' || this.props.type === 'pages' ) { this.setMetaData(); };
        window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 
    }; 
    
    componentDidUpdate() {
        // Typical usage (don't forget to compare props):
        if ( this.state.id !== this.props.id || this.state.type !== this.props.type ) { 
            this.setContentData();
            if ( this.props.type === 'posts' || this.props.type === 'pages' ) { this.setMetaData(); };
            window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 
        }       
    }    
    
    render() {
        return  (
                    <div>{ Object.keys( this.state.content ).length === 0 && this.state.content.constructor === Object ? <LoadWait /> : this.formatContent( this.state.content ) }</div> 
                );
    };
};

export default SWContent;
