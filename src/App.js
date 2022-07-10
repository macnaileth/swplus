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
//routes
import Toolbox from "./routes/Toolbox";
import Updates from "./routes/Updates";

import SWCodeSearch from './components/SWCodeSearch.jsx';

class App extends React.Component {
    
    constructor(props) {
      super(props);
      this.state =  { 
                        mainnav: { updates:'Updates', toolbox: 'Toolbox' },
                        footnav: { about:'Über', legal: 'Impressum', privacy: 'Datenschutz' }
                    };
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
                <main className="bg-white">
                    <div className="container">
                            <Routes>                
                                <Route path="/" element={ < Toolbox / > } />
                                <Route path="toolbox/*" element={ < Toolbox / > } /> 
                                <Route path="updates" element={ < Updates / > } />
                                <Route path="*" element={ < Updates / > } />                                 
                            </Routes>                   
                    </div>
                </main>
                <SWMainNav 
                  id="sw_foot_navigation"
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
