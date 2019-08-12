
/*
This script can be used to rewite the path when running a file locally
It can override a base href so that links to other local files will work

use :
<a href="javascript:getLocalPath('245_filter_applied.html');">

should make a version to rewrite image paths

*/

function getLocalPath (linkName) {

    // first we get the path of the file that called this function
    var filePath = location.href;

    var arrPath = filePath.split("/");
    var arrLength = arrPath.length;

    // get this file name
    var fileName = arrPath[arrLength - 1];

    // replace the file name with the file to link
    var newLink = filePath.replace(fileName, linkName);

     // link to the new local location
     window.location.href = newLink;

}
