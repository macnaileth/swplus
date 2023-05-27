/**
 * Content page
 * content from wp will be displayed here
 */

import React, { useState, Suspense, useEffect } from 'react';

//external ressources
import { useParams } from "react-router-dom"

//internal ressources - old school
import SWContent from '../components/SWContent';

export default function Content() {
  
    const { type, id } = useParams();
    const [update, setUpdate] = useState(0);

    return (
        <div className="py-3 sw-contentarea">
            <SWContent url={ window.location.href } type = { type } id={ id } />
        </div>
    );
}


