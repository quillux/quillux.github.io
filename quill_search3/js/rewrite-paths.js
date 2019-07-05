
/*
This script can be used to rewite the path when running a file locally
It can override a base href so that links to other local files will work

use :
<a href="javascript:getLocalPath('245_filter_applied.html');">

should make a version to rewrite image paths

*/

function getLocalPath (linkName) {

     
    // first we get the local path
    var filePath = location.pathname;    
    
    var arrPath = filePath.split("/");
    var arrLength = arrPath.length;
    
    // get this file name
    var fileName = arrPath[arrLength - 1];

    // replace the file name with the file to link
    var newLink = filePath.replace(fileName, linkName);
    
    // need to determine platform and browser to parse the path properluy  
    var stdPre = "file://";
    // extra slash escapes the backslash for windows - there is only one slash = c:\
    

      if (detectIE()) {
        // need to reverse the slashes and remove the first slash
        newLink = newLink.replace(/\//g, '\\');
        newLink = newLink.substr(1);
        
      } else {
         // just append the std path prefix 
         newLink = stdPre + newLink;
        
      }
   
     // link to the new local location
     window.location.href = newLink; 

}


function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older
    return true;
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11
    var rv = ua.indexOf('rv:');
    return true;
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+)
    return true;
  }

  // other browser
  return false;
}
