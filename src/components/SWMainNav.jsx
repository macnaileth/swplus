/**
 * SWMainNav React Navigation Component
 */
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import React from 'react';

//router links
import { Link } from "react-router-dom";

//settings from wpconnect
import settings from "../wpconnect/settings.json";  

//helpers
import { ResolveTerms, IsObject } from '../lib/GenericHelpers';

//react classes
export class SWMainNav extends React.Component {
    
    constructor(props) {
        super(props);
        this.navJustify = this.props.justify === undefined ? 'end' : this.props.justify;
        this.navBG = this.props.background === undefined ? 'white' : this.props.background;
        this.navVar = this.props.variant === undefined ? 'light' : this.props.variant;
        this.navSticky = this.props.sticky === undefined ? '' : this.props.sticky;
        this.navInnerClass = this.props.innerClass === undefined ? '' : ' ' + this.props.innerClass;
        this.navBrandLink = this.props.brandLink === undefined ? '/' : this.props.brandLink;
        this.navExpand = this.props.expand === undefined ? 'lg' : this.props.expand;
        this.navToggleClass = this.props.toggleClass === undefined ? '' : this.props.toggleClass;
        
        this.imagebrand = this.imagebrand.bind(this);
        this.navlinks = this.navlinks.bind(this);     
        this.navbarCollapse = this.navbarCollapse.bind(this);      
        this.navbarSimple = this.navbarSimple.bind(this);          
    }
    
    imagebrand(imgpath, alt = '', css = 'd-inline-block align-top') {
        return (
            <img
                src={ imgpath }                
                className={ css }
                alt={ alt }
            />
        );
    }

    navlinks() {
        return (
                <Nav className={ "justify-content-" + this.navJustify }>               
                    { 
                        Object.entries(this.props.links).map(([key, value]) => {
                            if ( this.props.wpconnect === true ) {
                                return this.props.links[key].link.route !== 'external' ? 
                                    <Link to={ '/content/' + ResolveTerms ( this.props.links[key].link.type, this.props.taglist, this.props.catlist ) + '/' + this.props.links[key].link.id }  className="nav-link" key={ key.toString() } href={ this.props.links[key].link.uri } >{ this.props.links[key].name }</Link>: 
                                    <a className="nav-link" key={ key.toString() } href={ this.props.links[key].link.uri } target="_blank" rel="noopener noreferrer" >{ this.props.links[key].name }</a>;
                            } else {
                                return (<Link to={ "/" + ( IsObject( value ) === true ? value.link : key ) } className="nav-link" key={key.toString()}>{ IsObject( value ) === true ? value.title : value }</Link>); 
                            }            
                        })                                            
                    }
                </Nav>                
               );
    }
    
    navbarCollapse () {
        return (
                  <Navbar bg={ this.navBG } variant={ this.navVar } expand={ this.navExpand } sticky={ this.navSticky } id={ this.props.id } className={ this.props.className }>
                      <Container>
                          { this.props.brand !== undefined &&
                              <Navbar.Brand>
                                <Link to={ this.navBrandLink }>
                                  { this.props.brandimg === undefined ? this.props.brand : 
                                      this.props.brandimg === true ? this.imagebrand( this.props.brand, this.props.brandalt ) : this.props.brand  
                                  }
                                </Link>
                              </Navbar.Brand>
                          }
                          <Navbar.Toggle aria-controls={ this.props.id + "_nav" } className={ this.navToggleClass } />
                          <Navbar.Collapse id={ this.props.id + "_nav" } className={ "justify-content-" + this.navJustify + this.navInnerClass }>
                              { this.navlinks() }
                          </Navbar.Collapse>  
                      </Container>
                  </Navbar>                 
               );
    }
    
    navbarSimple () {
        return (
                <div className={ 'bg-' + this.navBG + (this.props.className ? ' ' + this.props.className : '') }>
                    { this.navlinks() }
                </div>
               );
    }
    
    render() {
      return (
                this.props.collapse === false ? this.navbarSimple() : this.navbarCollapse()  
             );
    }
};

export default SWMainNav;
