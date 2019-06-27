
// get local path to use and replace all instances
var localFile = location.href;
var arrPath = localFile.split("/");
var arrLength = arrPath.length;

var newPath = "";

// remove the filename from the array and reassemble
for( i=0; i<(arrLength-1); i++ ) {
  newPath += arrPath[i] + "/";
}
  
// rewraite A tags that have "file:///locpath" as part of the link text
var arrAtags = document.getElementsByTagName("a");
 for ( z=0; z < arrAtags.length; z++ ) {
     var rePath = arrAtags[z].href;           
     arrAtags[z].href = rePath.replace('file:///locpath/', newPath);
 }

// rewrite img tags that have "file:///locpath" as part of the src text
var arrImgtags = document.getElementsByTagName("img");
 for ( x=0; x < arrImgtags.length; x++ ) {
     var reImgPath = arrImgtags[x].src;
     arrImgtags[x].src = reImgPath.replace('file:///locpath/', newPath);
 }
       