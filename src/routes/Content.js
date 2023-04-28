/**
 * Content page
 * content from wp will be displayed here
 */

import React, { useState, Suspense } from 'react';

//external ressources
//react-bootatstrap components

//internal ressources - old school
import SWContent from '../components/SWContent';

export default function Content() {
  return (
    <div className="py-3 sw-contentarea">
      <SWContent url={ window.location.href } />
    </div>
  );
}


