//third party ressources
import React from 'react';
//router
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
//scss
import './App.scss';
//internal ressources and compomnents
import SWMainNav from './components/SWMainNav.jsx';
import swSmallLogo from './img/logo/logo_sw_small.png';
import swLogo from './img/logo/socialwerks_logo.svg'; //-> TODO: Make this work
//routes
import Toolbox from "./routes/Toolbox";
import Updates from "./routes/Updates";
//package json for display version info
import packageJson from '../package.json';
class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state =  { 
                        mainnav: { updates:'Updates', toolbox: 'Toolbox' },
                        footnav: { about:'Über', legal: 'Impressum', privacy: 'Datenschutz' }
                    };
        this.statusPostLoad = this.statusPostLoad.bind(this);            
    } 
    
    statusPostLoad = () => { console.log( '%c*** social.werks+ App loaded | Version: ' + packageJson.version + ' ***', 'color:green;' ) };
    
    componentDidMount() {
        this.statusPostLoad();
    }
    
    render() {
        return (
          <div className="App">
            <BrowserRouter>
                <SWMainNav 
                  id="sw_main_navigation"
                  links={ this.state.mainnav }
                  sticky="top"
                  brandimg={ true }
                  brand={ swSmallLogo }
                  brandalt='Socialwerks Plus Logo'
                  expand="md"
                  className="border-bottom border-primary shadow-sm pb-3"
                  innerClass="pt-2"
                  toggleClass="border-0 pb-0 pt-2"
                />
                <main id="sw_main_content" className="bg-white">
                    <div className="container">
                            <Routes>                
                                <Route path="/" element={ < Toolbox / > } />
                                <Route path="toolbox/*" element={ < Toolbox / > } /> 
                                <Route path="updates" element={ < Updates / > } />
                                <Route path="*" element={ < Toolbox / > } />                                 
                            </Routes>                   
                    </div>
                </main>
                <SWMainNav 
                  id="sw_foot_navigation"
                  className="sw-footer"
                  justify='center'
                  links={ this.state.footnav }
                  background="dark"
                  collapse={ false }
                />    
            </BrowserRouter>
          </div>
        );
    }
};

export default App;
